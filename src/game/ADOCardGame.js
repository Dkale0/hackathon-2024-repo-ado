import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import ADOCard from '../components/core/ADOCard';
import DraggableItemMenu, { cardFields } from '../components/core/DraggableItemMenu';
import waterBackground from '../assets/water.gif';

const gameScenario = {
  prompt: {
    title: "Help Create a User Story:",
    speaker: "John Doe",
    message: "I need a card created for implementing login functionality. Here are the details:",
    details: [
      "It's part of our User Authentication Epic, low priority but a key feature",
      "We need email/password login, error handling, and a password reset flow",
      "It's a frontend task, probably a 5-point story for Sprint 1"
    ]
  },
  correctAnswers: {
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
  }
};

const GameContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-image: url(${waterBackground});
  background-repeat: repeat;
  background-size: auto;
  overflow-y: auto;
`;

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PromptBox = styled.div`
  width: 80%;
  max-width: 800px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 20px;

  h2 {
    margin: 0 0 10px 0;
    font-size: 18px;
    color: #333;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;
    text-align: left;
    display: inline-block;
  }
`;

const GameplayArea = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
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
  const promptRef = useRef(null);

  useEffect(() => {
    const isAllCorrect = Object.keys(gameScenario.correctAnswers).every(
      key => cardData.fields[key]?.value === gameScenario.correctAnswers[key]
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
    console.log("Proceeding to next step");
    // You can add your logic here for what happens when the user proceeds
  };

  return (
    <GameContainer>
      <GameContent>
        <PromptBox ref={promptRef}>
          <h2>{gameScenario.prompt.title}</h2>
          <p>{gameScenario.prompt.speaker} says: "{gameScenario.prompt.message}"</p>
          <ul>
            {gameScenario.prompt.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </PromptBox>
        <DragDropContext onDragEnd={onDragEnd}>
          <GameplayArea>
            <DraggableItemMenu />
            <ADOCard 
              cardData={cardData} 
              onItemClick={onItemClick} 
              correctAnswers={gameScenario.correctAnswers}
              allCorrect={allCorrect}
              onProceed={onProceed}
            />
          </GameplayArea>
        </DragDropContext>
      </GameContent>
    </GameContainer>
  );
};

export default ADOCardGame;