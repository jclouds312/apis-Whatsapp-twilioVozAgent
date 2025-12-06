<?php

namespace Sdkconsultoria\WhatsappCloudApi\Lib\Template\Adapter;

use Sdkconsultoria\WhatsappCloudApi\Services\ResumableUploadAPI;

class RequestToMeta
{
    public function process(array $template)
    {
        $processed = $template;
        unset($processed['waba_id']);

        $components = $template['components'];
        $components = array_map(function ($component, $index) {
            $component['type'] = strtoupper($index);

            if ($component['type'] === 'HEADER' && in_array($component['format'], ['IMAGE', 'VIDEO', 'DOCUMENT'])) {
                $filePath = $component['example']['header_handle'][0]->getRealPath();
                $handler = resolve(ResumableUploadAPI::class)->uploadFile($filePath);
                $component['example']['header_handle'] = [$handler->handler];
            }

            if ($component['type'] === 'CAROUSEL') {
                foreach ($component['cards'] as $cardIndex => $card) {
                    $subComponents = [];
                    foreach ($card['components'] as $componentIndex => $subcomponent) {
                        $subcomponent['type'] = strtoupper($componentIndex);
                        if ($subcomponent['type'] === 'HEADER'){
                            $filePath = $subcomponent['example']['header_handle'][0]->getRealPath();
                            $handler = resolve(ResumableUploadAPI::class)->uploadFile($filePath);
                            $subcomponent['example']['header_handle'] = [$handler->handler];
                        }
                        $subComponents[] = $subcomponent;
                    }
                    $component['cards'][$cardIndex]['components'] = $subComponents;
                }
            }

            return $component;
        }, $components, array_keys($components));
        $processed['components'] = $components;

        return $processed;
    }
}
