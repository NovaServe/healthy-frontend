import React from 'react';
import '../style/card.css';

const CardTags = ({ tags }) => {
  return (
    <>
      {tags.map(tag => (
        <span className="card-tags" key={tag.id}>
          <small className="card-tag">{tag.name.toLowerCase()}</small>&nbsp;
        </span>
      ))}
    </>
  );
};

export default CardTags;