import { useState } from 'react';
import Select from 'react-select';
import type { StylesConfig, SingleValue } from 'react-select';
import type { ReactNode } from 'react';
import Professions from './Professions';
import Onboarding from './Onboarding';


import appStyles from './styles/App.module.css';
import btn from './styles/Buttons.module.css';
import typo from './styles/Typography.module.css';

// Структура для первого ряда
const firstRow = { ear: 0, eye: 0, hand: 0, nose: 0 };

// Структура для второго ряда
const secondRow = { picture: 0, scheme: 0, text: 0 };

// Структура для третьего ряда
const thirdRow = { images: 0, scenarios: 0, meanings: 0 };

// Структура для четвертого ряда
const fourthRow = { choleric: 0, sanguine: 0, phlegmatic: 0, melancholic: 0 };

// Структура для пятого ряда
const fifthRow = {
  level1: 0, level2: 0, level3: 0, level4: 0,
  level5: 0, level6: 0, level7: 0, level8: 0
};

// Вопросы первого ряда
const firstRowQuestions = [
  { text: 'Как вы относитесь к музыке?', effects: { ear: 1 } },
  { text: 'Как вы относитесь к живописи?', effects: { eye: 1 } },
  { text: 'Как вы относитесь к вкусу и запаху пищи?', effects: { nose: 1 } },
];

// Вопросы второго ряда
const secondRowQuestions = [
  { text: 'Я помню происшедшее во всех деталях', effects: { picture: 1 } },
  { text: 'Я сразу упрощаю и помню только самое важное', effects: { scheme: 1 } },
  { text: 'Я составляю текст и работаю с текстом', effects: { text: 1 } },
];

// Вопросы третьего ряда
const thirdRowQuestions = [
  { text: 'Я ценю образы', effects: { images: 1 } },
  { text: 'Я работаю со сценариями', effects: { scenarios: 1 } },
  { text: 'Я ищу смыслы', effects: { meanings: 1 } },
];

// Вопросы четвертого ряда
const fourthRowQuestions = [
  { text: 'Я самый быстрый', effects: { choleric: 1 } },
  { text: 'Я самый чувствительный', effects: { melancholic: 1 } },
  { text: 'Я самый дружелюбный', effects: { sanguine: 1 } },
  { text: 'Я самый выносливый', effects: { phlegmatic: 1 } },
];

// Вопросы пятого ряда
const fifthRowQuestions = [
  { text: 'Я люблю отдыхать один в темноте глядя на пламя свечи', effects: { level1: 1 } },
  { text: 'Я сразу отделяю своих от чужих', effects: { level2: 1 } },
  { text: 'Я хочу всегда быть первым', effects: { level3: 1 } },
  { text: 'Я командный игрок', effects: { level4: 1 } },
  { text: 'Я люблю импровизировать', effects: { level5: 1 } },
  { text: 'Я люблю строгость рассуждений', effects: { level6: 1 } },
  { text: 'Я - изобретатель', effects: { level7: 1 } },
  { text: 'Я умею моделировать чужое сознание как неоднородное своему', effects: { level8: 1 } },
];

function checkDistribution(
  values: Record<string, number>,
  expected: { много: number; средне: number; мало: number },
  fourthRowValues?: Record<string, number>
): boolean {
  const counts = { много: 0, средне: 0, мало: 0 };

  Object.values(values).forEach((value) => {
    if (value === 1) counts.много++;
    else if (value === 0) counts.средне++;
    else counts.мало++;
  });

  // Пятый ряд с зависимостью от четвертого
  if (fourthRowValues) {
    if (counts.много !== 2 || counts.средне !== 2 || counts.мало !== 4) return false;

    const evenLevels = ['level2', 'level4', 'level6', 'level8'];
    const oddLevels = ['level1', 'level3', 'level5', 'level7'];

    const evenHighCount = evenLevels.filter((l) => values[l] === 1).length;
    const oddHighCount = oddLevels.filter((l) => values[l] === 1).length;
    const evenMediumCount = evenLevels.filter((l) => values[l] === 0).length;
    const oddMediumCount = oddLevels.filter((l) => values[l] === 0).length;

    if ((fourthRowValues.choleric === 1 || fourthRowValues.sanguine === 1) && oddHighCount !== 2) return false;
    if ((fourthRowValues.phlegmatic === 1 || fourthRowValues.melancholic === 1) && evenHighCount !== 2) return false;

    if ((fourthRowValues.choleric === 0 || fourthRowValues.sanguine === 0) && oddMediumCount !== 2) return false;
    if ((fourthRowValues.phlegmatic === 0 || fourthRowValues.melancholic === 0) && evenMediumCount !== 2) return false;

    return true;
  }

  // 1-й ряд — минимум по одному каждого типа
  if (expected.много === 1 && expected.средне === 1 && expected.мало === 2) {
    return counts.много >= 1 && counts.средне >= 1 && counts.мало >= 1;
  }

  // 4-й ряд — ровно 1/1/2
  if (Object.keys(values).length === 4 && fourthRowValues === undefined) {
    if (counts.много !== 1 || counts.средне !== 1 || counts.мало !== 2) return false;
    if (Object.values(values).some((v) => v !== 1 && v !== 0 && v !== -1)) return false;
    return true;
  }

  // Остальные
  return counts.много === expected.много && counts.средне === expected.средне && counts.мало === expected.мало;
}

function getTemperamentLabel(value: number): string {
  return value === 1 ? 'много' : value === 0 ? 'средне' : 'мало';
}

function getDistributionRules(fourthRowValues: Record<string, number>): string {
  const rules = [];

  const choleric = getTemperamentLabel(fourthRowValues.choleric);
  const sanguine = getTemperamentLabel(fourthRowValues.sanguine);
  const phlegmatic = getTemperamentLabel(fourthRowValues.phlegmatic);
  const melancholic = getTemperamentLabel(fourthRowValues.melancholic);

  rules.push(`Текущие значения темпераментов:`);
  rules.push(`Холерик: ${choleric}`);
  rules.push(`Сангвиник: ${sanguine}`);
  rules.push(`Флегматик: ${phlegmatic}`);
  rules.push(`Меланхолик: ${melancholic}`);
  rules.push(``);

  if (fourthRowValues.choleric === 1 || fourthRowValues.sanguine === 1) {
    rules.push(`Так как холерик или сангвиник имеют значение "много",`);
    rules.push(`2 значения "много" должны быть в нечетных уровнях (1, 3, 5, 7)`);
  }

  if (fourthRowValues.phlegmatic === 1 || fourthRowValues.melancholic === 1) {
    rules.push(`Так как флегматик или меланхолик имеют значение "много",`);
    rules.push(`2 значения "много" должны быть в четных уровнях (2, 4, 6, 8)`);
  }

  if (fourthRowValues.choleric === 0 || fourthRowValues.sanguine === 0) {
    rules.push(`Так как холерик или сангвиник имеют значение "средне",`);
    rules.push(`2 значения "средне" должны быть в нечетных уровнях (1, 3, 5, 7)`);
  }

  if (fourthRowValues.phlegmatic === 0 || fourthRowValues.melancholic === 0) {
    rules.push(`Так как флегматик или меланхолик имеют значение "средне",`);
    rules.push(`2 значения "средне" должны быть в четных уровнях (2, 4, 6, 8)`);
  }

  return rules.join('\n');
}

const toNum = (v: string) => (v === 'много' ? 1 : v === 'средне' ? 0 : -1);

const selectOptions = [
  { value: 'много', label: 'много' },
  { value: 'средне', label: 'средне' },
  { value: 'мало', label: 'мало' },
];

type OptionType = { value: string; label: string };

// Аккуратные стили для react-select (без вложенного control внутри option)
const selectStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    fontSize: '1em',
    minHeight: '2.2em',
    minWidth: 180,
    color: '#222',
    backgroundColor: '#fff',
    borderColor: '#c5ccd6',
    width: '100%',
    maxWidth: '99vw',
  }),
  menu: (base) => ({
    ...base,
    fontSize: '1em',
    color: '#222',
    backgroundColor: '#fff',
    zIndex: 9999,
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: '1em',
    color: '#222',
  }),
  option: (base, state) => ({
    ...base,
    color: '#222',
    backgroundColor: state.isSelected ? '#e6eaf0' : '#fff',
    ':active': { backgroundColor: '#dde8f3' },
  }),
};

type ValueLabel = 'много' | 'средне' | 'мало';

const valueStyles: Record<ValueLabel, React.CSSProperties> = {
  много: { backgroundColor: '#90EE90', padding: '10px', borderRadius: '4px' },
  средне: { backgroundColor: '#FFD700', padding: '10px', borderRadius: '4px' },
  мало: { backgroundColor: '#FFB6C1', padding: '10px', borderRadius: '4px' },
};

function getValueLabel(value: number): ValueLabel {
  return value === 1 ? 'много' : value === 0 ? 'средне' : 'мало';
}

export default function CardsApp() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(firstRow);
  const [secondValues, setSecondValues] = useState(secondRow);
  const [thirdValues, setThirdValues] = useState(thirdRow);
  const [fourthValues, setFourthValues] = useState(fourthRow);
  const [fifthValues, setFifthValues] = useState(fifthRow);

  const [showCorrection, setShowCorrection] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);

  const [currentRow, setCurrentRow] = useState<'first' | 'second' | 'third' | 'fourth' | 'fifth'>('first');
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'start' | 'cards' | 'professions'>('onboarding');

  const [compareMode, setCompareMode] = useState(false);
  const [userMap, setUserMap] = useState<any>(null);

  const [showLastMapScreen, setShowLastMapScreen] = useState(false);
  const [lastMap, setLastMap] = useState<any>(null);

  const [currentStrategyScreen, setCurrentStrategyScreen] = useState(false);
  const strategyList = ['аутсайдер', 'потребитель', 'транслятор', 'автор', 'странник'];
  const [strategyValues, setStrategyValues] = useState<number[]>([0, 0, 0, 0, 0]);

  const isValid =
    currentRow === 'first'
      ? checkDistribution(values, { много: 1, средне: 1, мало: 2 })
      : currentRow === 'second'
      ? checkDistribution(secondValues, { много: 1, средне: 1, мало: 1 })
      : currentRow === 'third'
      ? checkDistribution(thirdValues, { много: 1, средне: 1, мало: 1 })
      : currentRow === 'fourth'
      ? (() => {
          const counts = { много: 0, средне: 0, мало: 0 };
          Object.values(fourthValues).forEach((v) => {
            if (v === 1) counts.много++;
            else if (v === 0) counts.средне++;
            else counts.мало++;
          });
          return counts.много === 1 && counts.средне === 1 && counts.мало === 2;
        })()
      : checkDistribution(fifthValues, { много: 2, средне: 2, мало: 4 }, fourthValues);

  const handleAnswer = (value: 1 | 0 | -1) => {
    if (currentRow === 'first') {
      const question = firstRowQuestions[step];
      const updated = { ...values };
      Object.keys(question.effects).forEach((key) => {
        updated[key as keyof typeof firstRow] = value;
      });
      setValues(updated);
      if (step + 1 < firstRowQuestions.length) setStep(step + 1);
      else setShowCorrection(true);
    } else if (currentRow === 'second') {
      const question = secondRowQuestions[step];
      const updated = { ...secondValues };
      Object.keys(question.effects).forEach((key) => {
        updated[key as keyof typeof secondRow] = value;
      });
      setSecondValues(updated);
      if (step + 1 < secondRowQuestions.length) setStep(step + 1);
      else setShowCorrection(true);
    } else if (currentRow === 'third') {
      const question = thirdRowQuestions[step];
      const updated = { ...thirdValues };
      Object.keys(question.effects).forEach((key) => {
        updated[key as keyof typeof thirdRow] = value;
      });
      setThirdValues(updated);
      if (step + 1 < thirdRowQuestions.length) setStep(step + 1);
      else setShowCorrection(true);
    } else if (currentRow === 'fourth') {
      const question = fourthRowQuestions[step];
      const updated = { ...fourthValues };
      Object.keys(question.effects).forEach((key) => {
        updated[key as keyof typeof fourthRow] = value;
      });
      setFourthValues(updated);
      if (step + 1 < fourthRowQuestions.length) setStep(step + 1);
      else setShowCorrection(true);
    } else {
      const question = fifthRowQuestions[step];
      const updated = { ...fifthValues };
      Object.keys(question.effects).forEach((key) => {
        updated[key as keyof typeof fifthRow] = value;
      });
      setFifthValues(updated);
      if (step + 1 < fifthRowQuestions.length) setStep(step + 1);
      else setShowCorrection(true);
    }
  };

  const handleValueChange = (
    key: string,
    value: string,
    row: 'first' | 'second' | 'third' | 'fourth' | 'fifth'
  ) => {
    if (row === 'first') {
      setValues({ ...values, [key]: toNum(value) });
    } else if (row === 'second') {
      setSecondValues({ ...secondValues, [key]: toNum(value) });
    } else if (row === 'third') {
      setThirdValues({ ...thirdValues, [key]: toNum(value) });
    } else if (row === 'fourth') {
      setFourthValues({ ...fourthValues, [key]: toNum(value) });
    } else {
      setFifthValues({ ...fifthValues, [key]: toNum(value) });
    }
  };

  const handleNext = () => {
    if (currentRow === 'first') setCurrentRow('second');
    else if (currentRow === 'second') setCurrentRow('third');
    else if (currentRow === 'third') setCurrentRow('fourth');
    else if (currentRow === 'fourth') setCurrentRow('fifth');
    setStep(0);
    setShowCorrection(false);
  };

  const resetAll = () => {
    setStep(0);
    setValues(firstRow);
    setSecondValues(secondRow);
    setThirdValues(thirdRow);
    setFourthValues(fourthRow);
    setFifthValues(fifthRow);
    setShowCorrection(false);
    setShowFinalResults(false);
    setCurrentRow('first');
    setCurrentScreen('start');
    setShowLastMapScreen(false);
    setCurrentStrategyScreen(false);
    setCompareMode(false);
    setUserMap(null);
  };

  // ---------- Подготовка контента экрана ----------
  let content: ReactNode = null;

  // Экраны внутри стартового
  const showLastMap = () => {
    const mapStr = localStorage.getItem('lastUserMap');
    if (mapStr) {
      setLastMap(JSON.parse(mapStr));
      setShowLastMapScreen(true);
    } else {
      alert('Карта не найдена');
    }
  };

  if (currentScreen === 'onboarding') {
  return (
    <Onboarding onFinish={() => setCurrentScreen('start')} />
  );
}

  if (currentScreen === 'start') {
    // Подэкран: Последняя карта
    if (showLastMapScreen && lastMap) {
      content = (
        <div>
          <h2>Последняя карта личности</h2>
          <table style={{ overflowX: 'auto', display: 'block', maxWidth: '100vw' }}>
            <tbody>
              {/* 1 ряд */}
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>1 ряд</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Ухо</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Глаз</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Рука</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Нос и язык</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
                <td style={valueStyles[getValueLabel(lastMap.ear)]}>{getValueLabel(lastMap.ear)}</td>
                <td style={valueStyles[getValueLabel(lastMap.eye)]}>{getValueLabel(lastMap.eye)}</td>
                <td style={valueStyles[getValueLabel(lastMap.hand)]}>{getValueLabel(lastMap.hand)}</td>
                <td style={valueStyles[getValueLabel(lastMap.nose)]}>{getValueLabel(lastMap.nose)}</td>
              </tr>

              {/* 2 ряд */}
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>2 ряд</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Картинка</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Схема</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Текст</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
                <td style={valueStyles[getValueLabel(lastMap.picture)]}>{getValueLabel(lastMap.picture)}</td>
                <td style={valueStyles[getValueLabel(lastMap.scheme)]}>{getValueLabel(lastMap.scheme)}</td>
                <td style={valueStyles[getValueLabel(lastMap.text)]}>{getValueLabel(lastMap.text)}</td>
              </tr>

              {/* 3 ряд */}
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>3 ряд</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Образы</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Сценарии</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Смыслы</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
                <td style={valueStyles[getValueLabel(lastMap.images)]}>{getValueLabel(lastMap.images)}</td>
                <td style={valueStyles[getValueLabel(lastMap.scenarios)]}>{getValueLabel(lastMap.scenarios)}</td>
                <td style={valueStyles[getValueLabel(lastMap.meanings)]}>{getValueLabel(lastMap.meanings)}</td>
              </tr>

              {/* 4 ряд */}
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>4 ряд</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Холерик</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Сангвиник</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Флегматик</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Меланхолик</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
                <td style={valueStyles[getValueLabel(lastMap.choleric)]}>{getValueLabel(lastMap.choleric)}</td>
                <td style={valueStyles[getValueLabel(lastMap.sanguine)]}>{getValueLabel(lastMap.sanguine)}</td>
                <td style={valueStyles[getValueLabel(lastMap.phlegmatic)]}>{getValueLabel(lastMap.phlegmatic)}</td>
                <td style={valueStyles[getValueLabel(lastMap.melancholic)]}>{getValueLabel(lastMap.melancholic)}</td>
              </tr>

              {/* 5 ряд */}
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>5 ряд</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 1</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 3</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 2</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 4</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
                <td style={valueStyles[getValueLabel(lastMap.level1)]}>{getValueLabel(lastMap.level1)}</td>
                <td style={valueStyles[getValueLabel(lastMap.level3)]}>{getValueLabel(lastMap.level3)}</td>
                <td style={valueStyles[getValueLabel(lastMap.level2)]}>{getValueLabel(lastMap.level2)}</td>
                <td style={valueStyles[getValueLabel(lastMap.level4)]}>{getValueLabel(lastMap.level4)}</td>
              </tr>

              {/* 6 ряд */}
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>6 ряд</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 5</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 7</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 6</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 8</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
                <td style={valueStyles[getValueLabel(lastMap.level5)]}>{getValueLabel(lastMap.level5)}</td>
                <td style={valueStyles[getValueLabel(lastMap.level7)]}>{getValueLabel(lastMap.level7)}</td>
                <td style={valueStyles[getValueLabel(lastMap.level6)]}>{getValueLabel(lastMap.level6)}</td>
                <td style={valueStyles[getValueLabel(lastMap.level8)]}>{getValueLabel(lastMap.level8)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            <button className={btn.nextButton} onClick={() => setShowLastMapScreen(false)}>
              ДОМОЙ
            </button>
            <button
              className={btn.nextButton}
              onClick={() => {
                setUserMap(lastMap);
                setCompareMode(true);
                setCurrentScreen('professions');
                setShowLastMapScreen(false);
              }}
            >
              Сравнить с профессиями
            </button>
          </div>
        </div>
      );
    }
    // Подэкран: Стратегии
    else if (currentStrategyScreen) {
      const total = strategyValues.reduce((a, b) => a + b, 0);
      const handleChange = (idx: number, value: string) => {
        const arr = [...strategyValues];
        arr[idx] = Math.max(0, Math.floor(Number(value) || 0));
        setStrategyValues(arr);
      };
      const handleSave = () => {
        localStorage.setItem('lastStrategy', JSON.stringify(strategyValues));
        alert('Стратегии сохранены!');
        setCurrentStrategyScreen(false);
      };
      content = (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <h2 className={typo.h2}>Распределите 100 баллов между стратегиями</h2>
          <table style={{ overflowX: 'auto', display: 'block', maxWidth: '100vw' }}>
            <tbody>
              {strategyList.map((strat, idx) => (
                <tr key={strat}>
                  <td style={{ padding: '10px 20px', textAlign: 'right' }}>{strat}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={strategyValues[idx]}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      style={{ fontSize: '1.2em', width: 80, textAlign: 'center' }}
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ margin: '20px 0', fontWeight: 'bold', fontSize: '1.1em' }}>
            Сумма: {total} / 100
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className={btn.nextButton} onClick={() => setCurrentStrategyScreen(false)}>
              Домой
            </button>
            <button className={btn.nextButton} onClick={handleSave} disabled={total !== 100}>
              Сохранить
            </button>
          </div>
          {total !== 100 && <div style={{ color: 'red', marginTop: 10 }}>Сумма баллов должна быть ровно 100</div>}
        </div>
      );
    }
    // Главное меню
    else {
      content = (
        <div>
  <h1 className={typo.h1}>Карта личности и карта задачи</h1>
  <div className={btn.buttonList}>
    <button className={btn.button} onClick={() => setCurrentScreen('cards')}>
      Составить КЛ
    </button>
    <button className={btn.button} onClick={showLastMap}>
      Показать КЛ
    </button>
    <button className={btn.button} onClick={() => setCurrentScreen('professions')}>
      Профессии
    </button>
    <button className={btn.button} onClick={() => setCurrentStrategyScreen(true)}>
      Стратегии
    </button>
  </div>
</div>

      );
    }
  } else if (currentScreen === 'professions') {
    content = (
      <Professions
        onHome={() => {
          setCurrentScreen('start');
          setCompareMode(false);
          setUserMap(null);
        }}
        compareMode={compareMode}
        userMap={userMap}
      />
    );
  } else if (showFinalResults) {
    const userMapObj = {
      ear: values.ear,
      eye: values.eye,
      hand: values.hand,
      nose: values.nose,
      picture: secondValues.picture,
      scheme: secondValues.scheme,
      text: secondValues.text,
      images: thirdValues.images,
      scenarios: thirdValues.scenarios,
      meanings: thirdValues.meanings,
      choleric: fourthValues.choleric,
      sanguine: fourthValues.sanguine,
      phlegmatic: fourthValues.phlegmatic,
      melancholic: fourthValues.melancholic,
      level1: fifthValues.level1,
      level2: fifthValues.level2,
      level3: fifthValues.level3,
      level4: fifthValues.level4,
      level5: fifthValues.level5,
      level6: fifthValues.level6,
      level7: fifthValues.level7,
      level8: fifthValues.level8,
    };
    localStorage.setItem('lastUserMap', JSON.stringify(userMapObj));

    content = (
      <div>
        <h2>Итоговые результаты:</h2>
        <table style={{ overflowX: 'auto', display: 'block', maxWidth: '100vw' }}>
          <tbody>
            {/* Первый ряд */}
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>1 ряд</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Ухо</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Глаз</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Рука</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Нос и язык</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
              <td style={valueStyles[getValueLabel(values.ear)]}>{getValueLabel(values.ear)}</td>
              <td style={valueStyles[getValueLabel(values.eye)]}>{getValueLabel(values.eye)}</td>
              <td style={valueStyles[getValueLabel(values.hand)]}>{getValueLabel(values.hand)}</td>
              <td style={valueStyles[getValueLabel(values.nose)]}>{getValueLabel(values.nose)}</td>
            </tr>

            {/* Второй ряд */}
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>2 ряд</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Картинка</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Схема</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Текст</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
              <td style={valueStyles[getValueLabel(secondValues.picture)]}>{getValueLabel(secondValues.picture)}</td>
              <td style={valueStyles[getValueLabel(secondValues.scheme)]}>{getValueLabel(secondValues.scheme)}</td>
              <td style={valueStyles[getValueLabel(secondValues.text)]}>{getValueLabel(secondValues.text)}</td>
            </tr>

            {/* Третий ряд */}
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>3 ряд</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Образы</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Сценарии</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Смыслы</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
              <td style={valueStyles[getValueLabel(thirdValues.images)]}>{getValueLabel(thirdValues.images)}</td>
              <td style={valueStyles[getValueLabel(thirdValues.scenarios)]}>{getValueLabel(thirdValues.scenarios)}</td>
              <td style={valueStyles[getValueLabel(thirdValues.meanings)]}>{getValueLabel(thirdValues.meanings)}</td>
            </tr>

            {/* Четвертый ряд */}
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>4 ряд</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Холерик</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Сангвиник</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Флегматик</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Меланхолик</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
              <td style={valueStyles[getValueLabel(fourthValues.choleric)]}>{getValueLabel(fourthValues.choleric)}</td>
              <td style={valueStyles[getValueLabel(fourthValues.sanguine)]}>{getValueLabel(fourthValues.sanguine)}</td>
              <td style={valueStyles[getValueLabel(fourthValues.phlegmatic)]}>{getValueLabel(fourthValues.phlegmatic)}</td>
              <td style={valueStyles[getValueLabel(fourthValues.melancholic)]}>{getValueLabel(fourthValues.melancholic)}</td>
            </tr>

            {/* Пятый ряд */}
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>5 ряд</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 1</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 3</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 2</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 4</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
              <td style={valueStyles[getValueLabel(fifthValues.level1)]}>{getValueLabel(fifthValues.level1)}</td>
              <td style={valueStyles[getValueLabel(fifthValues.level3)]}>{getValueLabel(fifthValues.level3)}</td>
              <td style={valueStyles[getValueLabel(fifthValues.level2)]}>{getValueLabel(fifthValues.level2)}</td>
              <td style={valueStyles[getValueLabel(fifthValues.level4)]}>{getValueLabel(fifthValues.level4)}</td>
            </tr>

            {/* Шестой ряд */}
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>6 ряд</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 5</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 7</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 6</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>Уровень 8</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: 10, border: '1px solid #ddd' }}>Значения</td>
              <td style={valueStyles[getValueLabel(fifthValues.level5)]}>{getValueLabel(fifthValues.level5)}</td>
              <td style={valueStyles[getValueLabel(fifthValues.level7)]}>{getValueLabel(fifthValues.level7)}</td>
              <td style={valueStyles[getValueLabel(fifthValues.level6)]}>{getValueLabel(fifthValues.level6)}</td>
              <td style={valueStyles[getValueLabel(fifthValues.level8)]}>{getValueLabel(fifthValues.level8)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          <button className={btn.nextButton} onClick={resetAll}>
            ДОМОЙ
          </button>
          <button
            className={btn.nextButton}
            onClick={() => {
              setUserMap({
                ear: values.ear,
                eye: values.eye,
                hand: values.hand,
                nose: values.nose,
                picture: secondValues.picture,
                scheme: secondValues.scheme,
                text: secondValues.text,
                images: thirdValues.images,
                scenarios: thirdValues.scenarios,
                meanings: thirdValues.meanings,
                choleric: fourthValues.choleric,
                sanguine: fourthValues.sanguine,
                phlegmatic: fourthValues.phlegmatic,
                melancholic: fourthValues.melancholic,
                level1: fifthValues.level1,
                level2: fifthValues.level2,
                level3: fifthValues.level3,
                level4: fifthValues.level4,
                level5: fifthValues.level5,
                level6: fifthValues.level6,
                level7: fifthValues.level7,
                level8: fifthValues.level8,
              });
              setCompareMode(true);
              setCurrentScreen('professions');
            }}
          >
            Сравнить с профессиями
          </button>
        </div>
      </div>
    );
  } else if (showCorrection) {
    let fields: { label: string; value: number; key: string }[] = [];

    if (currentRow === 'first') {
      fields = [
        { label: 'Ухо', value: values.ear, key: 'ear' },
        { label: 'Глаз', value: values.eye, key: 'eye' },
        { label: 'Рука', value: values.hand, key: 'hand' },
        { label: 'Нос и язык', value: values.nose, key: 'nose' },
      ];
    } else if (currentRow === 'second') {
      fields = [
        { label: 'Картинка', value: secondValues.picture, key: 'picture' },
        { label: 'Схема', value: secondValues.scheme, key: 'scheme' },
        { label: 'Текст', value: secondValues.text, key: 'text' },
      ];
    } else if (currentRow === 'third') {
      fields = [
        { label: 'Образы', value: thirdValues.images, key: 'images' },
        { label: 'Сценарии', value: thirdValues.scenarios, key: 'scenarios' },
        { label: 'Смыслы', value: thirdValues.meanings, key: 'meanings' },
      ];
    } else if (currentRow === 'fourth') {
      fields = [
        { label: 'Холерик', value: fourthValues.choleric, key: 'choleric' },
        { label: 'Сангвиник', value: fourthValues.sanguine, key: 'sanguine' },
        { label: 'Флегматик', value: fourthValues.phlegmatic, key: 'phlegmatic' },
        { label: 'Меланхолик', value: fourthValues.melancholic, key: 'melancholic' },
      ];
    } else if (currentRow === 'fifth') {
      fields = [
        { label: 'Уровень 1', value: fifthValues.level1, key: 'level1' },
        { label: 'Уровень 2', value: fifthValues.level2, key: 'level2' },
        { label: 'Уровень 3', value: fifthValues.level3, key: 'level3' },
        { label: 'Уровень 4', value: fifthValues.level4, key: 'level4' },
        { label: 'Уровень 5', value: fifthValues.level5, key: 'level5' },
        { label: 'Уровень 6', value: fifthValues.level6, key: 'level6' },
        { label: 'Уровень 7', value: fifthValues.level7, key: 'level7' },
        { label: 'Уровень 8', value: fifthValues.level8, key: 'level8' },
      ];
    }

    content = (
      <div>
        <h1 className={typo.h1}>Проверьте и при необходимости исправьте значения</h1>
        <div className={appStyles.correctionFields}>
          {fields.map((f) => (
            <label key={f.key} className={typo.label}>
              {f.label}
              <Select
                options={selectOptions}
                value={selectOptions.find((o) => o.value === getValueLabel(f.value))}
                onChange={(option: SingleValue<OptionType>) => handleValueChange(f.key, option!.value, currentRow)}
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </label>
          ))}
        </div>

        {isValid ? (
          <button
            className={btn.button}
            onClick={currentRow === 'fifth' ? () => setShowFinalResults(true) : handleNext}
          >
            {currentRow === 'fifth' ? 'Готово' : 'Дальше'}
          </button>
        ) : (
          <div className={typo.errorMessage}>
            {currentRow === 'first'
              ? 'Пожалуйста, исправьте значения так, чтобы было хотя бы одно "много", хотя бы одно "средне" и хотя бы одно "мало"'
              : currentRow === 'fourth'
              ? 'Пожалуйста, исправьте значения так, чтобы было ровно одно "много", ровно одно "средне" и два "мало"'
              : currentRow === 'fifth'
              ? (
                <>
                  <p>Пожалуйста, исправьте значения так, чтобы было: много — 2 раза, средне — 2 раза, мало — 4 раза.</p>
                  <pre className={typo.errorRules}>{getDistributionRules(fourthValues)}</pre>
                </>
                )
              : 'Пожалуйста, исправьте значения так, чтобы было: много — 1 раз, средне — 1 раз, мало — 1 раз'}
          </div>
        )}
      </div>
    );
  } else {
    // Экран вопросов
    const renderQuestion = (text: string) => (
      <>
        <h2 className={typo.questionTitle}>{text}</h2>
        {/* Колонкой, с одинаковыми отступами — контейнером служит smartButtonList */}
        <div className={btn.smartButtonList} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className={btn.button} onClick={() => handleAnswer(1)}>Да</button>
          <button className={btn.button} onClick={() => handleAnswer(0)}>Не знаю</button>
          <button className={btn.button} onClick={() => handleAnswer(-1)}>Нет</button>
        </div>
      </>
    );

    const renderLoveNeutral = (text: string) => (
      <>
        <h2 className={typo.questionTitle}>{text}</h2>
        <div className={btn.smartButtonList} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className={btn.button} onClick={() => handleAnswer(1)}>Люблю</button>
          <button className={btn.button} onClick={() => handleAnswer(0)}>Не знаю</button>
          <button className={btn.button} onClick={() => handleAnswer(-1)}>Равнодушен</button>
        </div>
      </>
    );

    if (currentRow === 'first' && step < firstRowQuestions.length) {
      content = <div>{renderLoveNeutral(firstRowQuestions[step].text)}</div>;
    } else if (currentRow === 'second' && step < secondRowQuestions.length) {
      content = <div>{renderQuestion(secondRowQuestions[step].text)}</div>;
    } else if (currentRow === 'third' && step < thirdRowQuestions.length) {
      content = <div>{renderQuestion(thirdRowQuestions[step].text)}</div>;
    } else if (currentRow === 'fourth' && step < fourthRowQuestions.length) {
      content = <div>{renderQuestion(fourthRowQuestions[step].text)}</div>;
    } else if (currentRow === 'fifth' && step < fifthRowQuestions.length) {
      content = <div>{renderQuestion(fifthRowQuestions[step].text)}</div>;
    } else {
      // на всякий случай
      content = <div />;
    }
  }

  // ---------- ЕДИНСТВЕННЫЙ RETURN ----------
  return (
    <div className={appStyles.appContainer}>
      {/* Верхняя панель с постоянной кнопкой Домой */}
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          margin: '0 auto 8px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <button
          className={btn.smallHome}
          onClick={resetAll}
          style={{ maxWidth: 140, margin: 0 }}
        >
          🏠︎
        </button>
      </div>

      {/* Текущий экран */}
      {content}
    </div>
  );
}
