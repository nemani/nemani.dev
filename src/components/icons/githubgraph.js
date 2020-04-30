import React from 'react';
import styled from 'styled-components';
import { github } from '@config';

const GitHubUsername = github.split('/').pop();

const StyledContainer = styled.div`
  padding: 0px;
  margin-top: 10px;
`;

const GitHubGraph = () => (
  <StyledContainer>
    <a href={github}>
      <img
        src={`https://ghchart.rshah.org/${GitHubUsername}`}
        alt={`${GitHubUsername}'s GitHub Contributions Chart`}
      />
    </a>
  </StyledContainer>
);

export default GitHubGraph;
