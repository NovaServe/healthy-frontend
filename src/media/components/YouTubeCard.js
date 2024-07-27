import React from 'react';
import Button from '../../shared/components/Button';
import { truncateStringWithWordBoundary } from '../../shared/services/util';

const YouTubeCard = ({ id, title, subtitle, description, httpRef, httpRefTypeName, isCustom }) => {
  return (
    <div className='card-custom'>
      <div className='card-title-custom'>{truncateStringWithWordBoundary(title, 30)}</div>
      <div className='card-subtitle-custom'>{subtitle}</div>
      <div className='card-description'>{truncateStringWithWordBoundary(description, 200)}</div>

      {httpRefTypeName === 'YOUTUBE' && (
        <div>
          <iframe width="240" height="140"
            src={httpRef}
            title="YouTube video player" frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
            style={{ marginBottom: 8 }}
          >
          </iframe>
          {isCustom && <Button title='Manage' link={`/media/workouts/${id}`} />}
        </div>
      )}

      {httpRefTypeName === 'OTHER' && (
        <div>
          <Button title='Manage' link={`/media/workouts/${id}`} />
          <Button title='Open' link={httpRef} />
        </div>
      )}
    </div>
  );
};

export default YouTubeCard;