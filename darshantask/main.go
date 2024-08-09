package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"hardware/pb/pb"
	"hardware/service"
	"log"
	"net"
	"net/http"
	"time"

	"google.golang.org/grpc"
)

//	type Server struct {
//		pb.ListServiceServer
//	}
type Metadata struct {
	ClientId int `json:"clientId"`
}

func main() {
	// Connect to PostgreSQL
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"", "", "", "", "")
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping PostgreSQL: %v", err)
	}

	log.Println("Connected to PostgreSQL")

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	//register and store data base connection in server struct and import it in other api methods through server injection
	grpcServer := grpc.NewServer()
	pb.RegisterListServiceServer(grpcServer, &service.Server{
		Db: db,
	})

	log.Println("Server is running on port 50051...")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
	listener2, err := net.Listen("tcp", "0.0.0.0:3000")
	if err != nil {
		log.Fatal(err)
	}
	// if decoding any token use the below middleware
	var router http.Handler
	mux := http.NewServeMux()
	mux.Handle("/", router)
	mux.HandleFunc("/api/rs/v1/health", func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Service is running"})
	})
	//rest server started concurrently on other thread to listen and serve
	go http.Serve(listener2, cors(mux))
	log.Print(" rest api server started")
	for {
		time.Sleep(10000 * time.Second)
	}
}
func cors(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, ResponseType")
		h.ServeHTTP(w, r)
	})
}
