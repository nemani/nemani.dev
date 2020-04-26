import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  padding: 0px;
  margin-top: 10px;
`;

const GitHubGraph = () => (
  <StyledContainer>
    <a href="https://github.com/nemaniarjun">
      <img
        src="http://ghchart.rshah.org/2016rshah"
        alt="2016rshah's Github chart"
      />
    </a>
  </StyledContainer>
);

export default GitHubGraph;
