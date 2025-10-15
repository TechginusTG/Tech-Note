import { FC } from 'react';
import styles from './page.module.css';

const AboutPage: FC = () => {
  const values = [
    {
      title: 'Accessibility for All',
      text: 'We believe technology should be accessible to everyone. We are committed to creating content that is inclusive and easy to understand for a diverse audience.',
    },
    {
      title: 'Innovation at the Core',
      text: 'We are passionate about exploring the latest trends and advancements in technology. Our goal is to share cutting-edge knowledge and inspire innovation.',
    },
    {
      title: 'Community and Collaboration',
      text: 'We foster a strong sense of community by encouraging discussions and knowledge sharing. We believe that collaboration is key to growth and learning.',
    },
    {
      title: 'Privacy Matters',
      text: 'We have a deep respect for user privacy. We are committed to being transparent about how we handle data and protecting our users' information.',
    },
    {
      title: 'Lifelong Learning',
      text: 'The world of technology is always evolving. We are dedicated to continuous learning and sharing our journey with our readers.',
    },
    {
      title: 'Quality and Excellence',
      text: 'We strive for the highest standards of quality in our content. Our commitment to excellence ensures that our readers receive accurate and valuable information.',
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Core Values</h1>
      <div className={styles.grid}>
        {values.map((value, index) => (
          <div key={index} className={styles.card}>
            <h2 className={styles.cardTitle}>{value.title}</h2>
            <p className={styles.cardText}>{value.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;