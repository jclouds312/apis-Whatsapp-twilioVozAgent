<?php

namespace Sdkconsultoria\WhatsappCloudApi\Tests\Feature\Message;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Mockery\MockInterface;
use Sdkconsultoria\OpenAiApi\Events\MessageReady;
use Sdkconsultoria\OpenAiApi\Models\Assistant;
use Sdkconsultoria\OpenAiApi\Tests\Fake\RunFakeResponses;
use Sdkconsultoria\OpenAiApi\Tests\Fake\ThreadFakeResponses;
use Sdkconsultoria\WhatsappCloudApi\Events\NewWhatsappMessageHook;
use Sdkconsultoria\WhatsappCloudApi\Models\Chat;
use Sdkconsultoria\WhatsappCloudApi\Models\Message;
use Sdkconsultoria\WhatsappCloudApi\Models\WabaPhone;
use Sdkconsultoria\WhatsappCloudApi\Services\MediaManagerService;
use Sdkconsultoria\WhatsappCloudApi\Tests\Fake\Webhook\FakeReceivedMessage;
use Sdkconsultoria\WhatsappCloudApi\Tests\TestCase;

class ReceivedMessageTest extends TestCase
{
    use WithFaker;

    public function test_recive_text_message_proxy_enabled()
    {
        Config::set('meta.webhook_redirect', 'http://localhost-fake/webhook');
        Http::fake([
            'http://localhost-fake/webhook' => Http::response(['status' => 'ok'], 200),
        ]);

        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->post(route('meta.webhook'), FakeReceivedMessage::textMessage($wabaPhone, $messageId));
        $response->assertStatus(200);

        Event::assertDispatched(NewWhatsappMessageHook::class, function ($e) {
            return true;
        });
    }

    public function test_recive_text_message_verify_signature()
    {
        Config::set('meta.webhook_verify_signature', true);

        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->withHeaders($this->signRequest())->post(route('meta.webhook'), FakeReceivedMessage::textMessage($wabaPhone, $messageId));
        $response->assertStatus(200);

        Event::assertDispatched(NewWhatsappMessageHook::class, function ($e) {
            return true;
        });
    }

    public function test_recive_text_message_verify_signature_invalid()
    {
        Config::set('meta.webhook_verify_signature', true);

        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->withHeaders([
            'x-hub-signature' => 'fake-signature',
        ])->post(route('meta.webhook'), FakeReceivedMessage::textMessage($wabaPhone, $messageId));
        $response->assertStatus(403);
    }

    public function test_recive_text_message()
    {
        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->post(route('meta.webhook'), FakeReceivedMessage::textMessage($wabaPhone, $messageId));
        $response->assertStatus(200);

        Event::assertDispatched(NewWhatsappMessageHook::class, function ($e) {
            return true;
        });
    }

    public function test_recive_text_message_reply()
    {
        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        Message::factory()->create(['message_id' => $messageId.'-reply']);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->post(route('meta.webhook'), FakeReceivedMessage::responseTextMessage($wabaPhone, $messageId));
        $response->assertStatus(200);
    }

    public function test_recive_text_message_reply_missing_message()
    {
        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->post(route('meta.webhook'), FakeReceivedMessage::responseTextMessage($wabaPhone, $messageId));
        $response->assertStatus(404);
    }

    public function test_recive_image_message()
    {
        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $this->partialMock(MediaManagerService::class, function (MockInterface $mock) {
            $mock->shouldReceive('download')->once()->andReturn('http://localhost/avatar.jpg');
        });

        $response = $this->post(route('meta.webhook'), FakeReceivedMessage::imageMessage($wabaPhone, $messageId));
        $response->assertStatus(200);

        Event::assertDispatched(NewWhatsappMessageHook::class, function ($e) {
            return true;
        });
    }

    public function test_recive_reaction_message()
    {
        $message = Message::factory()->create();
        $wabaPhone = WabaPhone::factory()->create();
        Event::fake();

        $response = $this->withHeaders($this->signRequest())->post(route('meta.webhook'), FakeReceivedMessage::reactionMessage($wabaPhone, $message->message_id));
        $response->assertStatus(200);

        $this->assertDatabaseHas('messages', [
            'message_id' => $message->message_id,
            'reaction' => 'Carita feliz',
        ]);

        Event::assertDispatched(NewWhatsappMessageHook::class, function ($e) {
            return true;
        });
    }

    private function signRequest()
    {
        $secret = config('meta.app_secret');
        $signature = 'sha1='.hash_hmac('sha1', '', $secret);

        return [
            'x-hub-signature' => $signature,
        ];
    }

    public function test_recive_text_message_new_bot()
    {
        Assistant::factory()->create();
        $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
        $wabaPhone = WabaPhone::factory()->create();
        $chat = Chat::findOrCreateChat('16315551234', $wabaPhone);
        $chat->bot = true;
        $chat->save();

        Event::fake();
        Http::fake([
            '*/threads/runs' => Http::response(ThreadFakeResponses::createdAndRunThread(), 200),
            '*/threads/thread_Hklgt9a1cgrSFhQpjcuKLwb6/runs/run_KpRc1KmHmj4pTtfwl1k0VAZp' => Http::response(RunFakeResponses::getRun(), 200),
            '*/threads/thread_Hklgt9a1cgrSFhQpjcuKLwb6/messages' => Http::response(RunFakeResponses::getMessages(), 200),
        ]);

        $response = $this->post(route('meta.webhook'), FakeReceivedMessage::textMessage($wabaPhone, $messageId));
        $response->assertStatus(200);

        Event::assertDispatched(NewWhatsappMessageHook::class);
        Event::assertDispatched(MessageReady::class);
    }

    // public function test_recive_text_message_bot()
    // {
    //     Assistant::factory()->create();
    //     $messageId = 'wamid.'.$this->faker()->numberBetween(111, 450);
    //     $wabaPhone = WabaPhone::factory()->create();
    //     $chat = Chat::findOrCreateChat('16315551234', $wabaPhone);
    //     $chat->bot = true;
    //     $chat->save();

    //     Event::fake();
    //     Http::fake([
    //         '*/threads' => Http::response(ThreadFakeResponses::createdThread(), 200),
    //         '*/threads/thread_iPddOOFKpb2lhXRDpj2P4wUH/messages' => Http::response(ThreadFakeResponses::addedMessageThread(), 200),
    //         '*/threads/thread_iPddOOFKpb2lhXRDpj2P4wUH/runs' => Http::response(RunFakeResponses::addedRunToThread(), 200),
    //         '*/threads/thread_iPddOOFKpb2lhXRDpj2P4wUH/runs/run_KpRc1KmHmj4pTtfwl1k0VAZp' => Http::response(RunFakeResponses::getRun(), 200),
    //         '*/threads/thread_iPddOOFKpb2lhXRDpj2P4wUH/messages' => Http::response(RunFakeResponses::getMessages(), 200),
    //     ]);

    //     $response = $this->post(route('meta.webhook'), FakeReceivedMessage::textMessage($wabaPhone, $messageId));
    //     $response->assertStatus(200);

    //     Event::assertDispatched(NewWhatsappMessageHook::class);
    //     Event::assertDispatched(MessageReady::class);
    // }
}
