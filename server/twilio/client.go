
package twilio

import (
	"os"
	twilioApi "github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

type TwilioClient struct {
	client *twilioApi.RestClient
}

func NewTwilioClient() *TwilioClient {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	
	client := twilioApi.NewRestClientWithParams(twilioApi.ClientParams{
		Username: accountSid,
		Password: authToken,
	})
	
	return &TwilioClient{
		client: client,
	}
}

func (tc *TwilioClient) SendMessage(from, to, body string) (*openapi.ApiV2010Message, error) {
	params := &openapi.CreateMessageParams{}
	params.SetFrom(from)
	params.SetTo(to)
	params.SetBody(body)
	
	resp, err := tc.client.Api.CreateMessage(params)
	return resp, err
}

func (tc *TwilioClient) GetAccount() (*openapi.ApiV2010Account, error) {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	resp, err := tc.client.Api.FetchAccount(accountSid)
	return resp, err
}

func (tc *TwilioClient) ListPhoneNumbers() (*[]openapi.ApiV2010IncomingPhoneNumber, error) {
	params := &openapi.ListIncomingPhoneNumberParams{}
	
	resp, err := tc.client.Api.ListIncomingPhoneNumber(params)
	if err != nil {
		return nil, err
	}
	
	return &resp, nil
}

func (tc *TwilioClient) GetClient() *twilioApi.RestClient {
	return tc.client
}
