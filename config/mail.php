<?php

return [

    'default' => 'smtp',

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'host' => 'sandbox.smtp.mailtrap.io',
            'port' => 2525,
            'username' => '1e6f87e49e3e55',
            'password' => '65e1ccb83b8b95', // ✅ correct one
            'encryption' => null, // ✅ REQUIRED
            'timeout' => null,
        ],

        'log' => [
            'transport' => 'log',
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => ['smtp', 'log'],
        ],
    ],

    'from' => [
        'address' => 'test@example.com',
        'name' => 'CRM Project',
    ],

];