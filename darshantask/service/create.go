package service

import (
	"context"
	"database/sql"
	"fmt"
	"hardware/pb/pb"
	"time"
)

type Server struct {
	pb.ListServiceServer
	Db *sql.DB
}

func (s *Server) CreateOrUpdateMovie(ctx context.Context, in *pb.MovieRequest) (*pb.MovieResponse, error) {
	var id int
	var err error
	//validation for year range 
	CurrentYear := time.Now().Year()
	if in.Year < 1900 || in.Year > int32(CurrentYear) {
        return nil, fmt.Errorf("Year must be between 1900 and %d", CurrentYear)
    }

	// check for existing title and id
	var existingID int
    err = s.Db.QueryRow(`SELECT id FROM movies WHERE title=$1 AND id<>$2`, in.Title, in.Id).Scan(&existingID)
    if err != nil && err != sql.ErrNoRows {
        return nil, fmt.Errorf("failed to check for duplicate title: %v", err)
    }
    if existingID > 0 {
        return nil, fmt.Errorf("a movie with the title '%s' already exists", in.Title)
    }

    //if id =="" insert condition else update condition
	if in.Id == "" {
		query := `INSERT INTO movies (title, genre, year, rating) VALUES ($1, $2, $3, $4) RETURNING id`
		err = s.Db.QueryRow(query, in.Title, in.Genre, in.Year, in.Rating).Scan(&id)
	} else {
		query := `UPDATE movies SET title=$1, genre=$2, year=$3, rating=$4 WHERE id=$5 RETURNING id`
		err = s.Db.QueryRow(query, in.Title, in.Genre, in.Year, in.Rating, in.Id).Scan(&id)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to insert or update movie: %v", err)
	}

	return &pb.MovieResponse{
		Id:      fmt.Sprintf("%d", id),
		Message: "Movie created/updated successfully",
	}, nil
	//return &pb.MovieResponse{Id: "success", Message: "stored successfully"}, nil
}
