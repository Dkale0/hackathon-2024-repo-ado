import React, { useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import './ADOCard.css';

const AssignedSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--card-border);
`;

const AssignedToColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const LabelsColumn = styled.div`
  flex-grow: 1;
  margin-left: var(--spacing-md);
`;

const ADOCard = ({ cardData, onItemClick, correctAnswers, onProceed, onHint }) => {
  const [allCorrect, setAllCorrect] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const stateOptions = ['New', 'Active', 'Resolved', 'Closed'];
  const assignedToOptions = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
  const areaOptions = ['Frontend', 'Backend', 'Database', 'DevOps'];
  const reasonOptions = ['New Feature', 'Bug Fix', 'Improvement', 'Technical Debt'];
  const iterationOptions = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Backlog'];
  const storyPointOptions = ['1', '2', '3', '5', '8', '13', '21'];
  const priorityOptions = ['1', '2', '3', '4'];

  useEffect(() => {
    const isAllCorrect = Object.keys(correctAnswers).every(
      key => cardData.fields[key]?.value === correctAnswers[key]
    );
    setAllCorrect(isAllCorrect);
    if (isAllCorrect) {
      setShowMessage(true);
    }
  }, [cardData, correctAnswers]);

  const safelyGetField = (fieldKey) => {
    return cardData?.fields?.[fieldKey] || { value: '' };
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderDropdown = (fieldKey, options) => (
    <select 
      className={`field-dropdown ${correctAnswers[fieldKey] === safelyGetField(fieldKey).value ? 'correct' : ''}`}
      value={safelyGetField(fieldKey).value}
      onChange={(e) => onItemClick(fieldKey, e.target.value)}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );

  const renderField = (fieldKey) => (
    <Droppable droppableId={fieldKey} type={fieldKey}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`field ${fieldKey} ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
        >
          <div 
            className={`field-value ${correctAnswers[fieldKey] === safelyGetField(fieldKey).value ? 'correct' : ''}`}
            onClick={() => safelyGetField(fieldKey).value && onItemClick(fieldKey)}
          >
            {safelyGetField(fieldKey).value || `Drag ${fieldKey} here`}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  const handleHint = () => {
    onHint();
  };

  const handleProceed = () => {
    if (allCorrect) {
      onProceed();
    }
  };

  return (
    <div className="ado-card">
      <div className="card-header">
        <div className="card-icon-id">
          <span className="card-icon">📘</span>
          <span className="card-type-id">USER STORY {cardData?.id || 'US1001'}</span>
        </div>
      </div>
      <div className="card-content">
        <div className="left-column">
          <div className="title-section">
            {renderField("Title")}
          </div>
          <AssignedSection>
            <AssignedToColumn>
              <label>{capitalizeFirstLetter('Assigned to')}:</label>
              <div className="assigned-to-dropdown">
                {renderDropdown('assignedTo', assignedToOptions)}
              </div>
            </AssignedToColumn>
            <LabelsColumn>
              <label>{capitalizeFirstLetter('Labels')}:</label>
              {renderField("Labels")}
            </LabelsColumn>
          </AssignedSection>
          <div className="details-section">
            <div className="details-row">
              <div className="details-field">
                <label>{capitalizeFirstLetter('State')}:</label>
                {renderDropdown('state', stateOptions)}
              </div>
              <div className="details-field">
                <label>{capitalizeFirstLetter('Area')}:</label>
                {renderDropdown('area', areaOptions)}
              </div>
            </div>
            <div className="details-row">
              <div className="details-field">
                <label>{capitalizeFirstLetter('Reason')}:</label>
                {renderDropdown('reason', reasonOptions)}
              </div>
              <div className="details-field">
                <label>{capitalizeFirstLetter('Iteration')}:</label>
                {renderDropdown('iteration', iterationOptions)}
              </div>
            </div>
          </div>
          <div className="description-field">
            <label>Description:</label>
            {renderField("Description")}
          </div>
          <div className="acceptance-criteria-field">
            <label>Acceptance Criteria:</label>
            {renderField("Acceptance Criteria")}
          </div>
        </div>
        <div className="right-column">
          <div className="planning-info">
            <div className="planning-field">
              <label>{capitalizeFirstLetter('Story Points')}:</label>
              {renderDropdown('storyPoints', storyPointOptions)}
            </div>
            <div className="planning-field">
              <label>{capitalizeFirstLetter('Priority')}:</label>
              {renderDropdown('priority', priorityOptions)}
            </div>
          </div>
          <div className="related-work">
            <h3>Related Work</h3>
            <div className="related-work-item">
              <label>Parent:</label>
              {renderField("Parent")}
            </div>
            <div className="related-work-item">
              <label>Related:</label>
              {renderField("Related")}
            </div>
          </div>
        </div>
      </div>
      <div className="card-bottom">
        <div className="card-message">
          {showMessage && "Good Job!"}
        </div>
        <div className="card-buttons">
          <button className="hint-button" onClick={handleHint}>Hint</button>
          <button 
            className={`proceed-button ${allCorrect ? 'active' : ''}`} 
            onClick={handleProceed}
            disabled={!allCorrect}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ADOCard;