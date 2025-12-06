
# pyVoIP Integration

This document describes the integration of the pyVoIP library into the project for VoIP calling capabilities.

## Overview

pyVoIP is a Python library that provides VoIP functionality, allowing you to make and receive calls using SIP (Session Initiation Protocol). This integration complements the existing Twilio voice capabilities.

## Installation

The pyVoIP library is installed from the GitHub repository:

```bash
pip install git+https://github.com/jclouds312/pyVoIP.git
```

## Configuration

Set the following environment variables for SIP configuration:

- `SIP_SERVER`: Your SIP server address
- `SIP_PORT`: SIP server port (default: 5060)
- `SIP_USERNAME`: Your SIP username
- `SIP_PASSWORD`: Your SIP password

## API Endpoints

### Initialize VoIP Service

```
POST /api/pyvoip/initialize
```

**Request Body:**
```json
{
  "sipServer": "sip.example.com",
  "sipPort": 5060,
  "username": "user123",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "VoIP initialized successfully"
}
```

### Make an Outbound Call

```
POST /api/pyvoip/call
```

**Request Body:**
```json
{
  "number": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "139876543210"
}
```

### Answer an Incoming Call

```
POST /api/pyvoip/answer/:callId
```

**Response:**
```json
{
  "success": true,
  "message": "Call answered"
}
```

### Hang Up a Call

```
POST /api/pyvoip/hangup/:callId
```

**Response:**
```json
{
  "success": true,
  "message": "Call ended"
}
```

### Get Call Status

```
GET /api/pyvoip/status/:callId
```

**Response:**
```json
{
  "success": true,
  "state": "ANSWERED"
}
```

## Call States

Possible call states returned by the status endpoint:

- `DIALING`: Call is being initiated
- `RINGING`: Call is ringing
- `ANSWERED`: Call has been answered
- `ENDED`: Call has ended
- `BUSY`: Number is busy
- `FAILED`: Call failed

## Integration with Existing Systems

The pyVoIP integration works alongside:

- **Twilio**: Use pyVoIP for direct SIP calling and Twilio for PSTN/SMS
- **Issabel PBX**: Can be configured to work with your Issabel installation
- **VoIP Extensions**: Manage extensions through the existing UI

## Usage Example

```javascript
// Initialize VoIP
await fetch('/api/pyvoip/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sipServer: 'sip.example.com',
    sipPort: 5060,
    username: 'user123',
    password: 'password123'
  })
});

// Make a call
const response = await fetch('/api/pyvoip/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ number: '+1234567890' })
});

const { callId } = await response.json();

// Check call status
const status = await fetch(`/api/pyvoip/status/${callId}`);
const { state } = await status.json();

// Hang up
await fetch(`/api/pyvoip/hangup/${callId}`, { method: 'POST' });
```

## Security Considerations

1. **Credentials**: Never commit SIP credentials to version control
2. **Authentication**: Ensure API endpoints are protected with proper authentication
3. **Encryption**: Use TLS/SRTP for secure call transmission
4. **Rate Limiting**: Implement rate limiting to prevent abuse

## Troubleshooting

### Phone Won't Start
- Check SIP server connectivity
- Verify credentials are correct
- Ensure port 5060 (or your custom port) is accessible

### Calls Fail to Connect
- Verify network connectivity
- Check SIP server logs
- Ensure proper firewall configuration

### Audio Issues
- Check codec compatibility
- Verify network bandwidth
- Test with different SIP servers

## Future Enhancements

- WebRTC integration for browser-based calling
- Call recording functionality
- Conference calling support
- Integration with Twilio Voice for hybrid routing
