import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import ADOCard from '../components/core/ADOCard';
import DraggableItemMenu, { cardFields } from '../components/core/DraggableItemMenu';
import waterBackground from '../assets/water.gif';

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 20px;
  gap: 20px;
  background-image: url(${waterBackground});
  background-repeat: repeat;
  background-size: auto;
`;

const ADOCardGame = () => {
  const [cardData, setCardData] = useState({
    fields: Object.fromEntries(
      Object.keys(cardFields).map(field => [field, { value: '' }])
    ),
  });

  const [allCorrect, setAllCorrect] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const correctAnswers = {
    Title: 'Implement login functionality',
    Labels: 'Feature',
    Description: 'Create a secure login system with email and password',
    'Acceptance Criteria': 'When the user enters valid credentials, then they should be logged in and redirected to the dashboard.\nWhen the user enters invalid credentials, then an error message should be displayed.\nWhen the user clicks "Forgot Password", then they should be redirected to the password reset page.',
    Parent: 'User Authentication Epic',
    Related: 'Update password reset flow',
    assignedTo: 'John Doe',
    state: 'New',
    area: 'Frontend',
    reason: 'New Feature',
    iteration: 'Sprint 1',
    storyPoints: '5',
    priority: '2'
  };

  useEffect(() => {
    const isAllCorrect = Object.keys(correctAnswers).every(
      key => cardData.fields[key]?.value === correctAnswers[key]
    );
    setAllCorrect(isAllCorrect);
  }, [cardData]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId.startsWith('menu-') && !destId.startsWith('menu-')) {
      const [, sourceField] = sourceId.split('-');
      const destField = destId;
      const draggedItem = cardFields[sourceField][source.index];

      setCardData(prevData => ({
        ...prevData,
        fields: {
          ...prevData.fields,
          [destField]: {
            value: sourceField === 'Labels' ? draggedItem.text : draggedItem,
          },
        },
      }));
    }
  };

  const onItemClick = (fieldKey, value) => {
    setCardData(prevData => ({
      ...prevData,
      fields: {
        ...prevData.fields,
        [fieldKey]: {
          value: value || '',
        },
      },
    }));
  };

  const onProceed = () => {
    // Handle proceeding to the next step or level
    console.log("Proceeding to next step");
    // You can add your logic here for what happens when the user proceeds
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <GameContainer style={{ width: windowSize.width, height: windowSize.height }}>
        <DraggableItemMenu />
        <ADOCard 
          cardData={cardData} 
          onItemClick={onItemClick} 
          correctAnswers={correctAnswers}
          allCorrect={allCorrect}
          onProceed={onProceed}
        />
      </GameContainer>
    </DragDropContext>
  );
};

export default ADOCardGame;