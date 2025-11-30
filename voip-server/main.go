
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type VoIPServer struct {
	db       *sql.DB
	upgrader websocket.Upgrader
}

type Call struct {
	ID          string    `json:"id"`
	CallSID     string    `json:"callSid"`
	From        string    `json:"from"`
	To          string    `json:"to"`
	Status      string    `json:"status"`
	Direction   string    `json:"direction"`
	Duration    int       `json:"duration"`
	RecordingURL string   `json:"recordingUrl"`
	CreatedAt   time.Time `json:"createdAt"`
	UserID      string    `json:"userId"`
}

type Recording struct {
	ID           string    `json:"id"`
	CallSID      string    `json:"callSid"`
	RecordingSID string    `json:"recordingSid"`
	Duration     int       `json:"duration"`
	Size         int64     `json:"size"`
	URL          string    `json:"url"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
	UserID       string    `json:"userId"`
}

type VoiceUser struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	PhoneNumber   string    `json:"phoneNumber"`
	Email         string    `json:"email"`
	Status        string    `json:"status"`
	TotalCalls    int       `json:"totalCalls"`
	TotalDuration int       `json:"totalDuration"`
	CreatedAt     time.Time `json:"createdAt"`
	UserID        string    `json:"userId"`
}

func NewVoIPServer() (*VoIPServer, error) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/voipdb?sslmode=disable"
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &VoIPServer{
		db: db,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}, nil
}

func (s *VoIPServer) InitializeDatabase() error {
	schema := `
	CREATE TABLE IF NOT EXISTS calls (
		id SERIAL PRIMARY KEY,
		call_sid VARCHAR(255) UNIQUE NOT NULL,
		from_number VARCHAR(50) NOT NULL,
		to_number VARCHAR(50) NOT NULL,
		status VARCHAR(50) NOT NULL,
		direction VARCHAR(20) NOT NULL,
		duration INTEGER DEFAULT 0,
		recording_url TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		user_id VARCHAR(255) NOT NULL,
		INDEX idx_user_id (user_id),
		INDEX idx_call_sid (call_sid),
		INDEX idx_status (status)
	);

	CREATE TABLE IF NOT EXISTS recordings (
		id SERIAL PRIMARY KEY,
		call_sid VARCHAR(255) NOT NULL,
		recording_sid VARCHAR(255) UNIQUE NOT NULL,
		duration INTEGER NOT NULL,
		size BIGINT NOT NULL,
		url TEXT NOT NULL,
		status VARCHAR(50) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		user_id VARCHAR(255) NOT NULL,
		INDEX idx_user_id (user_id),
		INDEX idx_call_sid (call_sid)
	);

	CREATE TABLE IF NOT EXISTS voice_users (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		phone_number VARCHAR(50) UNIQUE NOT NULL,
		email VARCHAR(255),
		status VARCHAR(20) DEFAULT 'active',
		total_calls INTEGER DEFAULT 0,
		total_duration INTEGER DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		user_id VARCHAR(255) NOT NULL,
		INDEX idx_user_id (user_id),
		INDEX idx_phone (phone_number)
	);

	CREATE TABLE IF NOT EXISTS api_keys (
		id SERIAL PRIMARY KEY,
		service VARCHAR(100) NOT NULL,
		key_value TEXT NOT NULL,
		description TEXT,
		status VARCHAR(20) DEFAULT 'active',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		user_id VARCHAR(255) NOT NULL,
		INDEX idx_user_id (user_id),
		INDEX idx_service (service)
	);
	`

	_, err := s.db.Exec(schema)
	return err
}

func (s *VoIPServer) HandleInitiateCall(w http.ResponseWriter, r *http.Request) {
	var request struct {
		From   string `json:"from"`
		To     string `json:"to"`
		UserID string `json:"userId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	callSID := fmt.Sprintf("CA%d", time.Now().UnixNano())
	
	query := `
		INSERT INTO calls (call_sid, from_number, to_number, status, direction, user_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	
	var callID int
	err := s.db.QueryRow(query, callSID, request.From, request.To, "queued", "outbound", request.UserID).Scan(&callID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"callSid": callSID,
		"status":  "queued",
		"id":      callID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *VoIPServer) HandleGetCalls(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	status := r.URL.Query().Get("status")

	query := `SELECT id, call_sid, from_number, to_number, status, direction, duration, recording_url, created_at, user_id FROM calls WHERE user_id = $1`
	args := []interface{}{userID}

	if status != "" {
		query += " AND status = $2"
		args = append(args, status)
	}

	query += " ORDER BY created_at DESC LIMIT 100"

	rows, err := s.db.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var calls []Call
	for rows.Next() {
		var call Call
		var recordingURL sql.NullString
		err := rows.Scan(&call.ID, &call.CallSID, &call.From, &call.To, &call.Status, &call.Direction, &call.Duration, &recordingURL, &call.CreatedAt, &call.UserID)
		if err != nil {
			continue
		}
		if recordingURL.Valid {
			call.RecordingURL = recordingURL.String
		}
		calls = append(calls, call)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(calls)
}

func (s *VoIPServer) HandleGetRecordings(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")

	query := `SELECT id, call_sid, recording_sid, duration, size, url, status, created_at, user_id FROM recordings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`

	rows, err := s.db.Query(query, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var recordings []Recording
	for rows.Next() {
		var rec Recording
		err := rows.Scan(&rec.ID, &rec.CallSID, &rec.RecordingSID, &rec.Duration, &rec.Size, &rec.URL, &rec.Status, &rec.CreatedAt, &rec.UserID)
		if err != nil {
			continue
		}
		recordings = append(recordings, rec)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recordings)
}

func (s *VoIPServer) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	for {
		var msg map[string]interface{}
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("WebSocket read error:", err)
			break
		}

		// Echo back for now - implement real-time call status updates
		conn.WriteJSON(map[string]string{
			"type":    "status",
			"message": "Call status updated",
		})
	}
}

func (s *VoIPServer) Close() error {
	return s.db.Close()
}

func main() {
	server, err := NewVoIPServer()
	if err != nil {
		log.Fatal("Failed to create VoIP server:", err)
	}
	defer server.Close()

	if err := server.InitializeDatabase(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/api/voip/calls", server.HandleInitiateCall).Methods("POST")
	r.HandleFunc("/api/voip/calls", server.HandleGetCalls).Methods("GET")
	r.HandleFunc("/api/voip/recordings", server.HandleGetRecordings).Methods("GET")
	r.HandleFunc("/ws/voip", server.HandleWebSocket)

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
	})

	port := os.Getenv("VOIP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("VoIP server starting on port %s", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, r))
}
