import { useState } from 'react';
import app from './styles/App.module.css';
import btn from './styles/Buttons.module.css';
import typo from './styles/Typography.module.css';
import s from './styles/Onboarding.module.css';

type Props = {
  onFinish: () => void;
  onSkip?: () => void;
};

export default function Onboarding({ onFinish, onSkip }: Props) {
  const slides = [
    {
      id: 1,
      title: 'Добро пожаловать в Карта Личности',
      subtitle:
        'Короткий тест — и вы получите наглядную карту ваших предпочтений.',
      image: '/icon.png',
    },
    {
      id: 2,
      title: 'Поймите свои сильные стороны',
      subtitle:
        'Увидите, что у вас «много/средне/мало» по ключевым осям восприятия.',
      emoji: '🧠',
    },
    {
      id: 3,
      title: 'Подбор профессий и сравнение с задачами',
      subtitle:
        'Сопоставьте свою карту с профессиями и требованиями конкретных задач.',
      emoji: '🧩',
    },
  ];

  const [i, setI] = useState(0);
  const last = i === slides.length - 1;

  const next = () => (last ? onFinish() : setI(i + 1));
  const skip = () => (onSkip ? onSkip() : onFinish());

  return (
    <div className={app.appContainer}>
      <div className={s.wrap}>
        <div className={s.emoji} aria-hidden>
          {slides[i].image ? (
            <img src={slides[i].image} alt="" className={s.logo} />
                ) : (slides[i].emoji)
          }
        </div>
        <h1 className={typo.h1}>{slides[i].title}</h1>
        <p className={s.subtitle}>{slides[i].subtitle}</p>

        <div className={s.dots} aria-label="индикатор страниц">
          {slides.map((_, idx) => (
            <span key={idx} className={`${s.dot} ${idx === i ? s.active : ''}`} />
          ))}
        </div>

        <div className={s.buttons}>
          <button className={btn.button} onClick={next}>
            {last ? 'Начать' : 'Дальше'}
          </button>
          <button className={btn.nextButton} onClick={skip}>
            Пропустить
          </button>
        </div>
      </div>
    </div>
  );
}
