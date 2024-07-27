import React from 'react';
import CardButton from './CardButton';
import CardTags from './CardTags';
import { truncateStringWithWordBoundary } from '../services/util';
import '../style/card.css';

const Card = ({ title, subtitle, tags, description, btnTitle, btnLink }) => {
  return (
    <div className='card-custom'>
      <div className='card-title-custom'>{truncateStringWithWordBoundary(title, 30)}</div>
      <div className='card-subtitle-custom'>{subtitle}</div>
      {tags && tags.length > 0 && (<CardTags tags={tags} />)}
      <div className='card-description'>{truncateStringWithWordBoundary(description, 200)}</div>
      <CardButton title={btnTitle} link={btnLink} />
    </div>
  );
};

export default Card;