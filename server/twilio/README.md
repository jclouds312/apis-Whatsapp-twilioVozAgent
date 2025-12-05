
# Twilio Go Integration

Esta carpeta contiene la integración del SDK oficial de Twilio para Go.

## Características

- **Cliente Twilio**: Wrapper del cliente oficial de Twilio Go
- **Mensajería SMS**: Enviar mensajes SMS usando la API de Twilio
- **Gestión de números**: Listar y gestionar números de teléfono
- **Información de cuenta**: Obtener detalles de la cuenta de Twilio

## Uso

### Configuración

Asegúrate de tener las siguientes variables de entorno configuradas:

```bash
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
```

### Ejemplo de uso

```go
package main

import (
    "fmt"
    "log"
    "./twilio"
)

func main() {
    client := twilio.NewTwilioClient()
    
    // Enviar un mensaje
    message, err := client.SendMessage(
        "+1234567890",  // from
        "+0987654321",  // to
        "Hello from Twilio Go!",
    )
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Message SID: %s\n", *message.Sid)
    
    // Obtener información de la cuenta
    account, err := client.GetAccount()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Account Name: %s\n", *account.FriendlyName)
    
    // Listar números de teléfono
    numbers, err := client.ListPhoneNumbers()
    if err != nil {
        log.Fatal(err)
    }
    for _, number := range *numbers {
        fmt.Printf("Number: %s\n", *number.PhoneNumber)
    }
}
```

## Recursos disponibles

El SDK de Twilio Go proporciona acceso completo a todas las APIs de Twilio:

- **Messaging**: SMS, MMS, WhatsApp
- **Voice**: Llamadas, conferencias, grabaciones
- **Video**: Salas, composiciones, grabaciones
- **Verify**: Verificación de identidad
- **Serverless**: Funciones y assets
- **Studio**: Flujos de trabajo
- **TaskRouter**: Enrutamiento de tareas
- **Sync**: Sincronización de datos en tiempo real
- Y muchos más...

## Referencias

- [Twilio Go SDK Documentation](https://github.com/twilio/twilio-go)
- [Twilio API Documentation](https://www.twilio.com/docs/api)
