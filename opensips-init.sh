
#!/bin/bash

echo "Initializing OpenSIPS server..."

# Check if opensips directory exists
if [ ! -d "opensips" ]; then
    echo "Error: opensips directory not found. Please clone the repository first."
    exit 1
fi

cd opensips

# Create basic configuration if not exists
if [ ! -f "opensips.cfg" ]; then
    echo "Creating basic OpenSIPS configuration..."
    cat > opensips.cfg << 'EOF'
# OpenSIPS configuration for Nexus Core VoIP
listen=udp:0.0.0.0:5060
listen=tcp:0.0.0.0:5060

loadmodule "signaling.so"
loadmodule "sl.so"
loadmodule "tm.so"
loadmodule "rr.so"
loadmodule "maxfwd.so"
loadmodule "usrloc.so"
loadmodule "registrar.so"
loadmodule "textops.so"
loadmodule "uri.so"
loadmodule "dialog.so"

modparam("rr", "append_fromtag", 1)
modparam("registrar", "default_expires", 3600)
modparam("usrloc", "db_mode", 0)

route {
    if (!mf_process_maxfwd_header(10)) {
        sl_send_reply(483, "Too Many Hops");
        exit;
    }

    if (is_method("REGISTER")) {
        save("location");
        exit;
    }

    if (!lookup("location")) {
        sl_send_reply(404, "Not Found");
        exit;
    }

    route(relay);
}

route[relay] {
    if (!t_relay()) {
        sl_reply_error();
    }
}
EOF
fi

echo "OpenSIPS initialization complete!"
echo "Configuration file: opensips/opensips.cfg"
echo "To start the server, use: POST /api/v1/opensips/start"
