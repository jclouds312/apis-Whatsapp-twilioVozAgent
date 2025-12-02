
#!/bin/bash

echo "====================================="
echo "OpenSIPS VoIP Server Initialization"
echo "====================================="

# Check if opensips directory exists
if [ ! -d "opensips" ]; then
    echo "Error: opensips directory not found. Please clone the repository first."
    exit 1
fi

cd opensips

# Create necessary directories
echo "Creating OpenSIPS directories..."
mkdir -p logs
mkdir -p run
mkdir -p db

# Create enhanced configuration if not exists
if [ ! -f "opensips.cfg" ]; then
    echo "Creating enhanced OpenSIPS configuration..."
    cat > opensips.cfg << 'EOF'
####### OpenSIPS Configuration for Nexus Core VoIP #######

####### Global Parameters #########
log_level=3
log_stderror=no
log_facility=LOG_LOCAL0

children=4
auto_aliases=no

####### Network Configuration #########
listen=udp:0.0.0.0:5060
listen=tcp:0.0.0.0:5060

####### Module Section #########
mpath="/usr/lib/x86_64-linux-gnu/opensips/modules/"

# Core signaling
loadmodule "signaling.so"
loadmodule "sl.so"
loadmodule "tm.so"
loadmodule "rr.so"
loadmodule "maxfwd.so"
loadmodule "textops.so"
loadmodule "uri.so"

# User location
loadmodule "usrloc.so"
loadmodule "registrar.so"

# Dialog management
loadmodule "dialog.so"

# Database for production
loadmodule "db_text.so"

# Management interface
loadmodule "mi_fifo.so"

# Statistics
loadmodule "statistics.so"

####### Module Parameters #########

# RR Module
modparam("rr", "append_fromtag", 1)

# Registrar Module
modparam("registrar", "default_expires", 3600)
modparam("registrar", "max_expires", 7200)

# User Location Module
modparam("usrloc", "db_mode", 0)
modparam("usrloc", "db_url", "text:///home/runner/workspace/opensips/db")

# Dialog Module
modparam("dialog", "dlg_flag", 4)
modparam("dialog", "default_timeout", 21600)

# MI FIFO Module
modparam("mi_fifo", "fifo_name", "/tmp/opensips_fifo")

# Statistics Module
modparam("statistics", "variable", "active_calls")
modparam("statistics", "variable", "processed_calls")

####### Routing Logic #########

route {
    # Initial sanity checks
    if (!mf_process_maxfwd_header(10)) {
        sl_send_reply(483, "Too Many Hops");
        exit;
    }

    if (msg:len > 2048) {
        sl_send_reply(513, "Message Too Big");
        exit;
    }

    # Record routing for dialog forming requests
    if (is_method("INVITE|SUBSCRIBE")) {
        record_route();
    }

    # Handle registrations
    if (is_method("REGISTER")) {
        if (!save("location")) {
            sl_reply_error();
        }
        exit;
    }

    # Handle in-dialog requests
    if (has_totag()) {
        if (loose_route()) {
            if (is_method("INVITE")) {
                record_route();
            }
            route(relay);
        } else {
            if (is_method("ACK")) {
                if (t_check_trans()) {
                    t_relay();
                    exit;
                }
            }
            sl_send_reply(404, "Not here");
        }
        exit;
    }

    # Handle initial requests
    if (is_method("CANCEL")) {
        if (t_check_trans()) {
            t_relay();
        }
        exit;
    }

    t_check_trans();

    # Lookup user location
    if (!lookup("location")) {
        t_reply(404, "Not Found");
        exit;
    }

    route(relay);
}

route[relay] {
    if (is_method("INVITE")) {
        create_dialog();
        setflag(4);
        update_stat("active_calls", "+1");
    }

    if (!t_relay()) {
        sl_reply_error();
    }
    
    if (is_method("BYE")) {
        update_stat("active_calls", "-1");
        update_stat("processed_calls", "+1");
    }
    exit;
}

# Error handling
onreply_route {
    if (t_check_status("(183)|(2[0-9][0-9])")) {
        if (is_method("INVITE")) {
            setflag(4);
        }
    }
}

failure_route {
    if (t_was_cancelled()) {
        exit;
    }
}
EOF
fi

echo "OpenSIPS initialization complete!"
echo ""
echo "Configuration file: opensips/opensips.cfg"
echo "Logs directory: opensips/logs"
echo "Run directory: opensips/run"
echo ""
echo "To start the server, use the API endpoint:"
echo "POST /api/v1/opensips/start"
echo ""
echo "To check server status:"
echo "GET /api/v1/opensips/status"
