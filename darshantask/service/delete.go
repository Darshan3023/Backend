package service

import (
	"context"
	"fmt"
	"hardware/pb/pb"
)

func (s *Server) DeleteMovie(ctx context.Context, in *pb.DeleteMovieRequest) (*pb.DeleteMovieResponse, error) {
	query := `DELETE FROM movies WHERE id=$1`
	_, err := s.Db.Exec(query, in.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to delete movie: %v", err)
	}

	return &pb.DeleteMovieResponse{
		Message: "Movie deleted successfully",
	}, nil
}
