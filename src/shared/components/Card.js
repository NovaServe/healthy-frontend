import React from 'react';
import CardButton from './CardButton';
import CardTags from './CardTags';
import { truncateStringWithWordBoundary } from '../services/util';
import '../style/card.css';

function Card({title, subtitle, tags, description, btnTitle, btnLink}) {
    return (
        <div className='card-border card-width card-padding card-margin card-bg card-shadow'>
            <div className='card-title-custom'>{truncateStringWithWordBoundary(title, 30)}</div>
            <div className='card-subtitle-custom'>{subtitle}</div>
            <CardTags tags={tags} />
            <div className='card-description'>{truncateStringWithWordBoundary(description, 200)}</div>
            <CardButton title={btnTitle} link={btnLink} />
        </div>
    );
}

export default Card;