import React from 'react';
import { graphql, Link } from 'gatsby';
import Helmet from 'react-helmet';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Layout, UtterancesComments } from '@components';
import styled from 'styled-components';
import { Main, theme } from '@styles';
const { colors } = theme;
import config from '@config';

const StyledPostContainer = styled(Main)`
  max-width: 1000px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
`;
const StyledPostContent = styled.div`
  margin-bottom: 100px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: ${colors.lightSlate};
  }
`;

const PostTemplate = ({ data, location }) => {
  const { frontmatter, html } = data.markdownRemark;
  const { title, date, tags, description } = frontmatter;

  const metaTitle = `${title} | Arjun Nemani`;
  const metaDescription = `${description} | Arjun Nemani`;
  const metaUrl = `https://nemani.dev${location.pathname}`;
  const metaKeywords = `${config.siteKeywords},${
    tags && tags.length > 0 && tags.map(tag => ` ${tag}`)
  }`;

  return (
    <Layout location={location}>
      <Helmet>
        <title>{metaTitle}</title>

        <link rel="canonical" href={metaUrl} />
        <meta property="og:url" href={metaUrl} />
        <meta name="twitter:url" href={metaUrl} />

        <meta itemProp="name" content={metaTitle} />
        <meta property="og:title" content={metaTitle} />
        <meta name="twitter:title" content={metaTitle} />

        <meta property="og:description" content={metaDescription} />
        <meta name="description" content={metaDescription} />
        <meta itemProp="description" content={metaDescription} />
        <meta name="twitter:description" content={metaDescription} />

        <meta name="keywords" content={metaKeywords} />
      </Helmet>

      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/blog">All posts</Link>
        </span>

        <StyledPostHeader>
          <h1 className="medium-title">{title}</h1>
          <p className="subtitle">
            <time>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {tags &&
              tags.length > 0 &&
              tags.map((tag, i) => (
                <Link
                  key={i}
                  to={`/blog/tags/${kebabCase(tag)}/`}
                  className="tag"
                >
                  #{tag}
                </Link>
              ))}
          </p>
        </StyledPostHeader>

        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />
        <UtterancesComments />
      </StyledPostContainer>
    </Layout>
  );
};

export default PostTemplate;

PostTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path } }) {
      html
      frontmatter {
        title
        description
        date
        slug
        tags
      }
    }
  }
`;
