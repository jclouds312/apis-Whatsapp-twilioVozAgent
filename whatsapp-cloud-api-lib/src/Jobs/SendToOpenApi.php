<?php

namespace Sdkconsultoria\WhatsappCloudApi\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Sdkconsultoria\OpenAiApi\Lib\Assistant\ThreadManager;
use Sdkconsultoria\OpenAiApi\Models\Assistant;
use Sdkconsultoria\OpenAiApi\Models\Thread;
use Sdkconsultoria\WhatsappCloudApi\Models\Chat;

class SendToOpenApi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Chat $chat,
        public array $content
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->chat->bot) {
            $assistant = Assistant::first();
            $thread = Thread::where('identifier', $this->content['from'])->first();
            if (! $thread) {
                resolve(ThreadManager::class)->createConversationWithAssistant($this->content['from'], $this->content['text']['body'], $assistant);
            } else {
                resolve(ThreadManager::class)->addMessage($thread, $this->content['text']['body']);
                resolve(ThreadManager::class)->addRunToThread($thread);
            }
        }
    }
}
