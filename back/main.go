package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	_ "github.com/mattn/go-sqlite3"

	_ "embed"
)

func main() {
	if err := run(); err != nil {
		log.Fatalln(err)
	}
}

func run() error {

	msgCh := &sync.Map{}

	// var msgCh = make(map[chan Msg]chan Msg)

	r := http.NewServeMux()
	r.HandleFunc("/msg/", createMsg(msgCh))
	r.HandleFunc("/msgs/", listenMsgs(msgCh))
	r.Handle("/", http.FileServer(http.Dir("../front/public")))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := http.Server{
		Addr: ":" + port,
		// WARNING: If we uncomment the lines below the SSE
		// stops working properly because of the timeout.
		// BAD: https://github.com/golang/go/issues/16100
		// ReadTimeout:  2 * time.Second,
		// WriteTimeout: 2 * time.Second,
		// ReadHeaderTimeout: 2 * time.Second,
		Handler: cors(r),
	}
	log.Println("listening on port :" + port)
	return srv.ListenAndServe()
}

func createMsg(msgCh *sync.Map) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		data, err := io.ReadAll(io.LimitReader(r.Body, 1*1024))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		data = bytes.TrimSpace(data)
		if len(data) == 0 {
			http.Error(w, "Stop hacking.", http.StatusBadRequest)
			return
		}

		msg := Msg{
			Who:  "Guest",
			Txt:  string(data),
			Date: time.Now().UTC(),
		}

		msgCh.Range(func(key, value interface{}) bool {
			key.(chan Msg) <- msg
			return true
		})

		w.WriteHeader(201)
	}
}

func listenMsgs(msgCh *sync.Map) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if _, ok := w.(http.Flusher); !ok {
			http.Error(w, "streaming not supported", http.StatusInternalServerError)
			return
		}

		myCh := make(chan Msg, 1)
		defer close(myCh)

		msgCh.Store(myCh, myCh)

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		// msg := Msg{
		// 	Who:  "Bot",
		// 	Txt:  "Welcome!",
		// 	Date: time.Now().UTC(),
		// }

		for {
			select {

			case msg := <-myCh:
				data, _ := json.Marshal(&msg)
				fmt.Fprintf(w, "data: %s\n\n", string(data))
				w.(http.Flusher).Flush()

			case <-r.Context().Done():
				msgCh.Delete(myCh)
				return
			}
		}
	}
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		if r.Method == http.MethodOptions {
			return
		}
		next.ServeHTTP(w, r)
	})
}

type Msg struct {
	Who  string    `json:"who"`
	Txt  string    `json:"txt"`
	Date time.Time `json:"date"`
}

func initDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "goodtalk.db")
	if err != nil {
		return nil, err
	}
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS events (
		id INTEGER PRIMARY KEY,
		date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		name TEXT NOT NULL,
		data TEXT NOT NULL
	);
	CREATE INDEX IF NOT EXISTS idx_events_name ON events (name);
	CREATE INDEX IF NOT EXISTS idx_events_date ON events (date);
	`)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func addEvent(db *sql.DB, name, data string) {
	tx, _ := db.Begin()
	stmt, _ := tx.Prepare("INSERT INTO events (name, data) VALUES (?,?)")
	_, err := stmt.Exec(name, data)
	if err != nil {
		log.Fatalln(err)
	}
	tx.Commit()
}
