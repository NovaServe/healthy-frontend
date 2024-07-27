import React, { useState } from 'react';
import { connect } from 'react-redux';
import Alert from '../../shared/components/Alert';
import { validateInput } from '../../shared/services/validation';
import { WARNING } from '../../shared/services/message';
import '../../shared/style/form.css';
import '../../shared/style/filter.css';
import '../style/exercises-filter.css';

const ExercisesFilter = ({ onFilterChange, isLoggedIn, bodyParts }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [bodyPartsIds, setBodyPartsIds] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [validationMessageType, setValidationMessageType] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationMessage = validateInput(title, description);
    if (validationMessage !== null) {
      setValidationMessage(validationMessage);
      setValidationMessageType(WARNING);
    } else {
      onFilterChange({
        title: title,
        description: description,
        isCustom: isCustom,
        isDefault: isDefault,
        bodyPartsIds: bodyPartsIds,
        sortField: sortField,
        sortDirection: sortDirection,
        pageSize: pageSize,
        currentPageZeroBased: 0
      });
    }
  };

  const handleFilterClick = () => {
    setIsVisible(!isVisible);
  };

  const handleClearFilter = () => {
    setTitle('');
    setDescription('');
    setIsDefault(false);
    setIsCustom(false);
    setBodyPartsIds([]);
    setSortField('');
    setSortDirection('');
    setPageSize('');

    setValidationMessage('');
    setValidationMessageType('');

    const clearedFilterParams = {
      title: '',
      description: '',
      isDefault: false,
      isCustom: false,
      bodyPartsIds: [],
      sortField: '',
      sortDirection: '',
      pageSize: '',
      currentPageZeroBased: 0
    };

    onFilterChange(clearedFilterParams);
  };

  return (
    <>
      <div>
        <button className='btn-custom' onClick={handleFilterClick}>Filter</button>
      </div>

      <form onSubmit={handleSubmit}
        className={'filter-custom' +
                    (isVisible ? ' filter-custom-open' : ' filter-custom-hidden')}>

        <div className='filter-group-of-group'>
          <div className='form-group filter-mr'>
            <label htmlFor="name" className='form-label'>Title</label>
            <input type="text" id="title" name="title" className='form-input'
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className='form-group'>
            <label htmlFor="description" className='form-label'>Description</label>
            <input type="description" id="description" name="description" className='form-input'
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor="bodyPartsIds" className='form-label'>Focus area</label>
          <select id="bodyPartsIds" name="bodyPartsIds"
            className='form-label form-input filter-mr exercises-filter-multiple-dropdown'
            value={bodyPartsIds}
            onChange={(e) => setBodyPartsIds(Array.from(e.target.selectedOptions, option => option.value))}
            multiple >
            {bodyParts.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </div>

        {validationMessage && (<Alert message={validationMessage}
          validationMessageType={validationMessageType} />)}

        {isLoggedIn && (
          <div className='filter-checkbox-group'>
            <input type="checkbox" id="isDefault" name="isDefault"
              checked={isLoggedIn && isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
            <label htmlFor="isDefault" className='filter-checkbox-mx'>In-app</label><br></br>

            <input type="checkbox" id="isCustom" name="isCustom"
              checked={isLoggedIn && isCustom} onChange={(e) => setIsCustom(e.target.checked)} />
            <label htmlFor="isCustom" className='filter-checkbox-mx'>Custom</label><br></br>
          </div>
        )}

        <div className='filter-group-of-group'>
          <div className='form-group'>
            <select id="sortField" name="sortField" className='form-label form-input filter-mr'
              value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="" disabled>Sort field</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
            </select>
          </div>

          <div className='form-group'>
            <select id="sortDirection" name="sortDirection" className='form-label form-input filter-mr'
              value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} >
              <option value="" disabled>Sort direction</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className='form-group'>
            <select id="pageSize" name="pageSize" className='form-label form-input'
              value={pageSize} onChange={(e) => setPageSize(e.target.value)} >
              <option value="" disabled>Page size</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>

        <button type="button" className='form-btn' onClick={handleClearFilter}
          style={{ marginRight: 8 }}>Clear</button>
        <input type="submit" value="Apply" className='form-btn' />
      </form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

export default connect(mapStateToProps)(ExercisesFilter);