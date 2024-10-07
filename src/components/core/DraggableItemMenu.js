import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import './DraggableItemMenu.css';

const MenuContainer = styled.div`
  width: 380px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  overflow-y: auto;
  max-height: 680px;
`;

const FieldToggle = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 8px;
  background-color: #e0e0e0;
  margin-bottom: 5px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const ToggleArrow = styled.span`
  font-size: 0.8em;
  margin-left: 5px;
`;

const AnswerList = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  padding-left: 10px;
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const DraggableAnswer = styled.div`
  padding: 6px;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  font-size: 12px;
  line-height: 1.2;

  &:hover {
    background-color: #f9f9f9;
  }

  ${props => props.customStyle}
`;

export const cardFields = {
  'Title': ['Implement login functionality', 'Design new user dashboard', 'Fix payment processing bug'],
  'Labels': [
    { text: 'Feature' },
    { text: 'Bug' },
    { text: 'Blocked' },
    { text: 'Enhancement' }
  ],
  'Description': ['Create a secure login system with email and password', 'Design an intuitive dashboard for users to view their account info', 'Investigate and resolve issues with payment gateway integration'],
  'Acceptance Criteria': [
    'When the user enters valid credentials, then they should be logged in and redirected to the dashboard.\nWhen the user enters invalid credentials, then an error message should be displayed.\nWhen the user clicks "Forgot Password", then they should be redirected to the password reset page.',
    'When the user logs in, then the dashboard should display their profile information, recent activity, and account balance.\nWhen the user clicks on a menu item, then the corresponding page should load without refreshing the entire page.',
    'When a customer initiates a payment, then the system should process it without errors.\nWhen a payment fails, then an appropriate error message should be displayed to the user and logged for the admin.'
  ],
  'Parent': ['User Authentication Epic', 'Dashboard Redesign Project', 'Payment System Overhaul'],
  'Related': ['Update password reset flow', 'Implement user settings page', 'Integrate with new payment provider API']
};

const DraggableItemMenu = () => {
  const [openFields, setOpenFields] = useState({
    Title: true,
    Labels: false,
    Description: false,
    'Acceptance Criteria': false,
    Parent: false,
    Related: false
  });

  const toggleField = (field) => {
    setOpenFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <MenuContainer className="draggable-item-menu">
      {Object.entries(cardFields).map(([field, items]) => (
        <div key={field}>
          <FieldToggle onClick={() => toggleField(field)}>
            {field}
            <ToggleArrow>{openFields[field] ? '▼' : '▶'}</ToggleArrow>
          </FieldToggle>
          <Droppable droppableId={`menu-${field}`} type={field}>
            {(provided) => (
              <AnswerList
                {...provided.droppableProps}
                ref={provided.innerRef}
                isOpen={openFields[field]}
              >
                {items.map((item, index) => (
                  <Draggable key={`${field}-${index}`} draggableId={`${field}-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <DraggableAnswer
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`menu-item ${snapshot.isDragging ? 'dragging' : ''}`}
                        customStyle={field === 'Labels' ? item.style : ''}
                      >
                        {field === 'Labels' ? item.text : item}
                      </DraggableAnswer>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </AnswerList>
            )}
          </Droppable>
        </div>
      ))}
    </MenuContainer>
  );
};

export default DraggableItemMenu;