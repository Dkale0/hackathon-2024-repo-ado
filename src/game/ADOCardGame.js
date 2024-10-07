import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import ADOCard from '../components/core/ADOCard';
import DraggableItemMenu, { cardFields } from '../components/core/DraggableItemMenu';
import waterBackground from '../assets/water.gif';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-image: url(${waterBackground});
  background-repeat: repeat;
  background-size: auto;
  position: relative;
`;

const GameContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: ${props => props.topMargin}px;
  transition: margin-top 0.3s ease-in-out;
`;

const PromptBox = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1400px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 16px;
  line-height: 1.4;
  text-align: left;
`;

const ADOCardGame = () => {
  const userStoryPrompt = "I need a card created for implementing login functionality. It's part of our User Authentication Epic. Low priority for now, but it'll be a key feature. We're talking email and password login, with proper error handling and a password reset flow. Should be a frontend task, probably a 5-point story. Let's target it for Sprint 1. Any questions, just ping me!";

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
  const [promptHeight, setPromptHeight] = useState(0);
  const promptRef = useRef(null);

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

  useEffect(() => {
    if (promptRef.current) {
      setPromptHeight(promptRef.current.offsetHeight);
    }
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
    <GameContainer>
      <PromptBox ref={promptRef}>{userStoryPrompt}</PromptBox>
      <DragDropContext onDragEnd={onDragEnd}>
        <GameContent topMargin={promptHeight + 40}>
          <DraggableItemMenu />
          <ADOCard 
            cardData={cardData} 
            onItemClick={onItemClick} 
            correctAnswers={correctAnswers}
            allCorrect={allCorrect}
            onProceed={onProceed}
          />
        </GameContent>
      </DragDropContext>
    </GameContainer>
  );
};

export default ADOCardGame;