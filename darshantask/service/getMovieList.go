package service

import (
	"context"
	"fmt"
	"hardware/pb/pb"
)

func (s *Server) GetMovieList(ctx context.Context, in *pb.MovieListRequest) (*pb.MovieListResponse, error) {
	query := `SELECT id, title, genre, year, rating FROM movies WHERE 
              ($1 = '' OR title ILIKE '%' || $1 || '%') AND
              ($2 = '' OR genre = $2) AND
              ($3 = 0 OR year = $3)
              ORDER BY title LIMIT $4 OFFSET $5`

	rows, err := s.Db.Query(query, in.Title, in.Genre, in.Year, in.PageSize, in.Page*in.PageSize)
	if err != nil {
		return nil, fmt.Errorf("failed to query movies: %v", err)
	}
	defer rows.Close()

	var movies []*pb.Movie
	for rows.Next() {
		var movie pb.Movie
		if err := rows.Scan(&movie.Id, &movie.Title, &movie.Genre, &movie.Year, &movie.Rating); err != nil {
			return nil, fmt.Errorf("failed to scan row: %v", err)
		}
		movies = append(movies, &movie)
	}

	
	var totalCount int
	err = s.Db.QueryRow(`SELECT COUNT(*) FROM movies WHERE 
                        ($1 = '' OR title ILIKE '%' || $1 || '%') AND
                        ($2 = '' OR genre = $2) AND
                        ($3 = 0 OR year = $3)`, in.Title, in.Genre, in.Year).Scan(&totalCount)
	if err != nil {
		return nil, fmt.Errorf("failed to get total count: %v", err)
	}

	return &pb.MovieListResponse{
		Movies:     movies,
		TotalCount: int32(totalCount),
	}, nil
}
