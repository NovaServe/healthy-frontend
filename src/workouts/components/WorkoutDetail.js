import React from 'react';
import Card from '../../shared/components/Card';
import CardTags from '../../shared/components/CardTags';
import '../../shared/style/card.css';

const WorkoutDetail = ({ title, subtitle, tags, description, exercises }) => {
  return (
    <div>
      <div className='card-title-custom'>{title}</div>
      <div className='card-subtitle-custom'>{subtitle}</div>
      {tags && tags.length > 0 && (<CardTags tags={tags} />)}
      <div className='card-description' style={{ marginBottom: 28 }}>{description}</div>

      <div className='custom-heading'>Exercises included</div>

      {exercises && exercises.length > 0 && (
        <div className='d-flex flex-wrap justify-content-left'>
          {exercises.map(item => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={`${item.isCustom ? 'Custom' : 'In-app'}`}
              tags={item.bodyParts}
              description={item.description}
              isCustom={item.isCustom}
              btnTitle='Detail'
              btnLink={item.isCustom ? `/workouts/exercise/custom/${item.id}` : `/workouts/exercise/default/${item.id}`}
            />
          ))
          }
        </div>)}
    </div>
  );
};

export default WorkoutDetail;