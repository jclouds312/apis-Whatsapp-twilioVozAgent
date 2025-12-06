<?php

namespace Sdkconsultoria\WhatsappCloudApi\Tests\Fake\Waba;

class FakeWabaResponses
{
    public static function getFakeWabaInfo()
    {
        return [
            'id' => '104996122399160',
            'currency' => 'USD',
            'name' => 'Lucky Shrub',
            'timezone_id' => '1',
            'message_template_namespace' => '58e6d318_b627_4112_b9c7_2961197553ea',
        ];
    }

    public static function fakePhoneNumbers()
    {
        return [
            'data' => [
                [
                    'verified_name' => "Jasper's Market",
                    'display_phone_number' => '+1 631-555-5555',
                    'id' => '1906385232743451',
                    'quality_rating' => 'GREEN',
                ],
                [
                    'verified_name' => "Jasper's Ice Cream",
                    'display_phone_number' => '+1 631-555-5556',
                    'id' => '1913623884432103',
                    'quality_rating' => 'NA',
                ],
            ],
        ];
    }

    public static function fakeTemplates()
    {
        return [
            'data' => [
                [
                    'name' => 'hello_world',
                    'previous_category' => 'ACCOUNT_UPDATE',
                    'components' => [
                        [
                            'type' => 'HEADER',
                            'format' => 'TEXT',
                            'text' => 'Hello World',
                        ],
                        [
                            'type' => 'BODY',
                            'text' => 'Welcome and congratulations!! This message demonstrates your ability to send a message notification from WhatsApp Business Platform’s Cloud API. Thank you for taking the time to test with us.',
                        ],
                        [
                            'type' => 'FOOTER',
                            'text' => 'WhatsApp Business API Team',
                        ],
                    ],
                    'language' => 'en_US',
                    'status' => 'APPROVED',
                    'category' => 'MARKETING',
                    'id' => '1192339204654487',
                ],
            ],
            'paging' => [
                'cursors' => [
                    'before' => 'MAZDZD',
                    'after' => 'MjQZD',
                ],
            ],
        ];
    }

    public static function fakeTemplateCaroucel()
    {
        $template = json_decode('{
            "name": "summer_carousel_promo_2023",
            "components": [
                {
                    "type": "BODY",
                    "text": "Summer is here, and we have the freshest produce around! Use code {{1}} to get {{2}} off your next order.",
                    "example": {
                        "body_text": [
                            [
                                "15OFF",
                                "15%"
                            ]
                        ]
                    }
                },
                {
                    "type": "CAROUSEL",
                    "cards": [
                        {
                            "components": [
                                {
                                    "type": "HEADER",
                                    "format": "IMAGE",
                                    "example": {
                                        "header_handle": [
                                            "https://scontent.whatsapp.net/v/t61.29466-34/426525185_1338374066855053_8321236007525765883_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=Yk4S4T-OOMcAb5hQ7zk&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&oh=01_ASDraMGMIs0FoktKjm9fo8k46LvJnR3AQwed0-aRWka8sw&oe=663CEFE5"
                                        ]
                                    }
                                },
                                {
                                    "type": "BODY",
                                    "text": "Rare lemons for unique cocktails. Use code {{1}} to get {{2}} off all produce.",
                                    "example": {
                                        "body_text": [
                                            [
                                                "15OFF",
                                                "15%"
                                            ]
                                        ]
                                    }
                                },
                                {
                                    "type": "BUTTONS",
                                    "buttons": [
                                        {
                                            "type": "QUICK_REPLY",
                                            "text": "Send more like this"
                                        },
                                        {
                                            "type": "URL",
                                            "text": "Buy now",
                                            "url": "https://www.luckyshrub.com/shop?promo={{1}}",
                                            "example": [
                                                "https://www.luckyshrub.com/shop?promo=summer_lemons_2023"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "components": [
                                {
                                    "type": "HEADER",
                                    "format": "IMAGE",
                                    "example": {
                                        "header_handle": [
                                            "https://scontent.whatsapp.net/v/t61.29466-34/427914944_1163793197871575_3630849530394187134_n.jpg?ccb=1-7&_nc_sid=a80384&_nc_ohc=d_vuChE8Cv8Ab4A_DTX&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&oh=01_ASAp_vfdURz-WtNc-qsAR3ALJI19agxP2j_To2oVVYqNEA&oe=663CCC17"
                                        ]
                                    }
                                },
                                {
                                    "type": "BODY",
                                    "text": "Exotic fruit for unique cocktails! Use code {{1}} to get {{2}} off all exotic produce.",
                                    "example": {
                                        "body_text": [
                                            [
                                                "20OFFEXOTIC",
                                                "20%"
                                            ]
                                        ]
                                    }
                                },
                                {
                                    "type": "BUTTONS",
                                    "buttons": [
                                        {
                                            "type": "QUICK_REPLY",
                                            "text": "Send more like this"
                                        },
                                        {
                                            "type": "URL",
                                            "text": "Buy now",
                                            "url": "https://www.luckyshrub.com/shop?promo={{1}}",
                                            "example": [
                                                "https://www.luckyshrub.com/shop?promo=exotic_produce_2023"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            "language": "en_US",
            "status": "APPROVED",
            "category": "MARKETING",
            "id": "123456789"
        }', true);

        return [
            'data' => [$template],
        ];
    }

    public static function fakeBussinesProfile()
    {
        return [
            'data' => [
                [
                    'about' => 'Hey there! I am using WhatsApp.',
                    'address' => 'Aldama #703',
                    'description' => 'Empresa de desarrollo de software, desde ERPS hasta sitios web Ecommerce',
                    'email' => 'ventas@sdkconsultoria.com',
                    'profile_picture_url' => 'https://pps.whatsapp.net/v/t61.24694-24/343259757_536735815203707_3565496183133281608_n.jpg?ccb=11-4&oh=01_AdRPsqmjabi6keV4__SnK7x_dlRYwFb_SicAa46sJkQbsQ&oe=65EFEB2F&_nc_sid=e6ed6c&_nc_cat=106',
                    'websites' => [
                        'https://sdkconsultoria.com/',
                    ],
                    'vertical' => 'PROF_SERVICES',
                    'messaging_product' => 'whatsapp',
                ],
            ],
        ];
    }
}
