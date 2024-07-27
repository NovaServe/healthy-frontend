import React from 'react';
import '../style/pagination.css';

const Pagination = ({ currentPageZeroBased, totalPages, onPageChange }) => {

  const onPageNumberClick = (newPageNumberZeroBased) => {
    onPageChange(newPageNumberZeroBased);
  };

  return (
    <div className='pagination-custom'>
      {Array.from({ length: totalPages }).map((_, index) =>
        (<div
          className={'pagination-item' + (index === currentPageZeroBased ? ' pagination-item-active' : '')}
          key={index}
          onClick={() => onPageNumberClick(index)}>{index + 1}</div>)
      )
      }
    </div>
  );
};

export default Pagination;