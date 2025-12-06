<?php

namespace Sdkconsultoria\WhatsappCloudApi\Listeners;

use Sdkconsultoria\OpenAiApi\Events\MessageReady;
use Sdkconsultoria\WhatsappCloudApi\Lib\Message\SendMessage;

class ResponseMessageReady
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        // ...
    }

    /**
     * Handle the event.
     */
    public function handle(MessageReady $event): void
    {
        $identifier = $event->run->thread->identifier;
        $message = $event->messages['data'][0]['content'][0]['text']['value'];

        resolve(SendMessage::class)->send([
            'waba_phone_id' => 1,
            'to' => $identifier,
            'message' => [
                'type' => 'text',
                'text' => [
                    'body' => $message,
                    'preview_url' => false,
                ],
            ],
        ], 'BOT');
    }
}
