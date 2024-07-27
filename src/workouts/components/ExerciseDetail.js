import React from 'react';
import CardTags from '../../shared/components/CardTags';
import YouTubeCard from '../../media/components/YouTubeCard';
import '../../shared/style/card.css';

const ExerciseDetail = ({ title, subtitle, tags, description, media }) => {
  return (
    <div>
      <div className='card-title-custom'>{title}</div>
      <div className='card-subtitle-custom'>{subtitle}</div>
      {tags && tags.length > 0 && (<CardTags tags={tags} />)}
      <div className='card-description' style={{ marginBottom: 28 }}>{description}</div>

      <div className='custom-heading'>Related media</div>

      {media && media.length > 0 && (
        <div className='d-flex flex-wrap justify-content-left'>
          {media.map(item => (
            <YouTubeCard
              key={item.id}
              id={item.id}
              title={item.name}
              subtitle={`${item.isCustom ? 'Custom' : 'In-app'}`}
              description={item.description}
              httpRef={item.ref}
              httpRefTypeName={item.httpRefTypeName}
              isCustom={item.isCustom}
            />
          ))
          }
        </div>)}
    </div>
  );
};

export default ExerciseDetail;