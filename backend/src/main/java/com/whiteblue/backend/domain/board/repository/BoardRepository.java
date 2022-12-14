package com.whiteblue.backend.domain.board.repository;

import com.whiteblue.backend.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
}
