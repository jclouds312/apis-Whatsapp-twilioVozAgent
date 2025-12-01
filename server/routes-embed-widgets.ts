import type { Express, Request, Response } from "express";

export function registerEmbedWidgetRoutes(app: Express) {
  // GET /embed/twilio-sms-widget.js - SMS Widget embed code
  app.get("/embed/twilio-sms-widget.js", (req: Request, res: Response) => {
    const apiKey = req.query.key as string;
    const apiUrl = `https://${req.get("host")}`;

    const widgetCode = `
(function() {
  const API_KEY = "${apiKey}";
  const API_URL = "${apiUrl}";

  function createSMSWidget() {
    const container = document.getElementById("nexus-sms-widget");
    if (!container) return;

    const widget = document.createElement("div");
    widget.innerHTML = \`
      <div style="
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
        ">
          <h3 style="margin: 0; font-size: 18px;">Send Message</h3>
          <p style="margin: 5px 0 0; opacity: 0.9; font-size: 12px;">via Twilio SMS</p>
        </div>
        <div style="padding: 20px; background: white;">
          <input 
            type="tel" 
            id="nexus-sms-phone" 
            placeholder="+1234567890"
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              box-sizing: border-box;
            "
          />
          <textarea 
            id="nexus-sms-message" 
            placeholder="Your message..."
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              min-height: 80px;
              resize: vertical;
              box-sizing: border-box;
              font-family: inherit;
            "
          ></textarea>
          <button 
            id="nexus-sms-send"
            style="
              width: 100%;
              padding: 10px;
              background: #667eea;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#764ba2'"
            onmouseout="this.style.background='#667eea'"
          >
            Send SMS
          </button>
          <p id="nexus-sms-status" style="
            margin: 10px 0 0;
            font-size: 12px;
            text-align: center;
            color: #666;
          "></p>
        </div>
      </div>
    \`;

    container.appendChild(widget);

    document.getElementById("nexus-sms-send").addEventListener("click", async function() {
      const phone = document.getElementById("nexus-sms-phone").value;
      const message = document.getElementById("nexus-sms-message").value;
      const status = document.getElementById("nexus-sms-status");

      if (!phone || !message) {
        status.textContent = "Please fill in all fields";
        status.style.color = "#d32f2f";
        return;
      }

      this.disabled = true;
      status.textContent = "Sending...";
      status.style.color = "#666";

      try {
        const response = await fetch(API_URL + "/api/v1/twilio/sms", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ to: phone, body: message })
        });

        const data = await response.json();
        if (data.success) {
          status.textContent = "✓ Message sent!";
          status.style.color = "#4caf50";
          document.getElementById("nexus-sms-message").value = "";
        } else {
          status.textContent = "Error: " + data.error;
          status.style.color = "#d32f2f";
        }
      } catch (error) {
        status.textContent = "Connection error";
        status.style.color = "#d32f2f";
      }

      this.disabled = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSMSWidget);
  } else {
    createSMSWidget();
  }
})();
    `;

    res.setHeader("Content-Type", "application/javascript");
    res.send(widgetCode);
  });

  // GET /embed/voice-widget.js - Voice Message Widget embed code
  app.get("/embed/voice-widget.js", (req: Request, res: Response) => {
    const apiKey = req.query.key as string;
    const apiUrl = `https://${req.get("host")}`;

    const widgetCode = `
(function() {
  const API_KEY = "${apiKey}";
  const API_URL = "${apiUrl}";

  function createVoiceWidget() {
    const container = document.getElementById("nexus-voice-widget");
    if (!container) return;

    const widget = document.createElement("div");
    widget.innerHTML = \`
      <div style="
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 20px;
          text-align: center;
        ">
          <h3 style="margin: 0; font-size: 18px;">Send Voice Message</h3>
          <p style="margin: 5px 0 0; opacity: 0.9; font-size: 12px;">via Twilio Voice</p>
        </div>
        <div style="padding: 20px; background: white;">
          <input 
            type="tel" 
            id="nexus-voice-phone" 
            placeholder="+1234567890"
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              box-sizing: border-box;
            "
          />
          <textarea 
            id="nexus-voice-message" 
            placeholder="Your voice message..."
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              min-height: 80px;
              resize: vertical;
              box-sizing: border-box;
              font-family: inherit;
            "
          ></textarea>
          <select 
            id="nexus-voice-type"
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              box-sizing: border-box;
            "
          >
            <option value="Alice">Alice (Female)</option>
            <option value="Woman">Woman (Female)</option>
            <option value="Man">Man (Male)</option>
          </select>
          <button 
            id="nexus-voice-send"
            style="
              width: 100%;
              padding: 10px;
              background: #f5576c;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#f093fb'"
            onmouseout="this.style.background='#f5576c'"
          >
            Send Voice Message
          </button>
          <p id="nexus-voice-status" style="
            margin: 10px 0 0;
            font-size: 12px;
            text-align: center;
            color: #666;
          "></p>
        </div>
      </div>
    \`;

    container.appendChild(widget);

    document.getElementById("nexus-voice-send").addEventListener("click", async function() {
      const phone = document.getElementById("nexus-voice-phone").value;
      const message = document.getElementById("nexus-voice-message").value;
      const voice = document.getElementById("nexus-voice-type").value;
      const status = document.getElementById("nexus-voice-status");

      if (!phone || !message) {
        status.textContent = "Please fill in all fields";
        status.style.color = "#d32f2f";
        return;
      }

      this.disabled = true;
      status.textContent = "Sending...";
      status.style.color = "#666";

      try {
        const response = await fetch(API_URL + "/api/v1/twilio/voice-message", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ to: phone, message, voice })
        });

        const data = await response.json();
        if (data.success) {
          status.textContent = "✓ Voice message sent!";
          status.style.color = "#4caf50";
          document.getElementById("nexus-voice-message").value = "";
        } else {
          status.textContent = "Error: " + data.error;
          status.style.color = "#d32f2f";
        }
      } catch (error) {
        status.textContent = "Connection error";
        status.style.color = "#d32f2f";
      }

      this.disabled = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createVoiceWidget);
  } else {
    createVoiceWidget();
  }
})();
    `;

    res.setHeader("Content-Type", "application/javascript");
    res.send(widgetCode);
  });

  // GET /embed/whatsapp-widget.js - WhatsApp Widget embed code
  app.get("/embed/whatsapp-widget.js", (req: Request, res: Response) => {
    const apiKey = req.query.key as string;
    const apiUrl = `https://${req.get("host")}`;

    const widgetCode = `
(function() {
  const API_KEY = "${apiKey}";
  const API_URL = "${apiUrl}";

  function createWhatsAppWidget() {
    const container = document.getElementById("nexus-whatsapp-widget");
    if (!container) return;

    const widget = document.createElement("div");
    widget.innerHTML = \`
      <div style="
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          color: white;
          padding: 20px;
          text-align: center;
        ">
          <h3 style="margin: 0; font-size: 18px;">Send WhatsApp</h3>
          <p style="margin: 5px 0 0; opacity: 0.9; font-size: 12px;">Chat Message</p>
        </div>
        <div style="padding: 20px; background: white;">
          <input 
            type="tel" 
            id="nexus-wa-phone" 
            placeholder="+1234567890"
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              box-sizing: border-box;
            "
          />
          <textarea 
            id="nexus-wa-message" 
            placeholder="Your WhatsApp message..."
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 14px;
              min-height: 80px;
              resize: vertical;
              box-sizing: border-box;
              font-family: inherit;
            "
          ></textarea>
          <button 
            id="nexus-wa-send"
            style="
              width: 100%;
              padding: 10px;
              background: #25d366;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#128c7e'"
            onmouseout="this.style.background='#25d366'"
          >
            Send Message
          </button>
          <p id="nexus-wa-status" style="
            margin: 10px 0 0;
            font-size: 12px;
            text-align: center;
            color: #666;
          "></p>
        </div>
      </div>
    \`;

    container.appendChild(widget);

    document.getElementById("nexus-wa-send").addEventListener("click", async function() {
      const phone = document.getElementById("nexus-wa-phone").value;
      const message = document.getElementById("nexus-wa-message").value;
      const status = document.getElementById("nexus-wa-status");

      if (!phone || !message) {
        status.textContent = "Please fill in all fields";
        status.style.color = "#d32f2f";
        return;
      }

      this.disabled = true;
      status.textContent = "Sending...";
      status.style.color = "#666";

      try {
        const response = await fetch(API_URL + "/api/v1/whatsapp/send", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ to: phone, message })
        });

        const data = await response.json();
        if (data.success) {
          status.textContent = "✓ Message sent!";
          status.style.color = "#4caf50";
          document.getElementById("nexus-wa-message").value = "";
        } else {
          status.textContent = "Error: " + data.error;
          status.style.color = "#d32f2f";
        }
      } catch (error) {
        status.textContent = "Connection error";
        status.style.color = "#d32f2f";
      }

      this.disabled = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWhatsAppWidget);
  } else {
    createWhatsAppWidget();
  }
})();
    `;

    res.setHeader("Content-Type", "application/javascript");
    res.send(widgetCode);
  });
}
