import { useState } from 'react';

// Структура для первого ряда
const firstRow = {
  ear: 0,    // ухо
  eye: 0,    // глаз
  hand: 0,   // рука
  nose: 0,   // нос и язык
};

// Структура для второго ряда
const secondRow = {
  picture: 0,  // картинка
  scheme: 0,   // схема
  text: 0,     // текст
};

// Структура для третьего ряда
const thirdRow = {
  images: 0,    // образы
  scenarios: 0, // сценарии
  meanings: 0,  // смыслы
};

// Структура для четвертого ряда
const fourthRow = {
  choleric: 0,    // холерик
  sanguine: 0,    // сангвиник
  phlegmatic: 0,  // флегматик
  melancholic: 0  // меланхолик
};

// Структура для пятого ряда
const fifthRow = {
  level1: 0,  // уровень 1
  level2: 0,  // уровень 2
  level3: 0,  // уровень 3
  level4: 0,  // уровень 4
  level5: 0,  // уровень 5
  level6: 0,  // уровень 6
  level7: 0,  // уровень 7
  level8: 0   // уровень 8
};

// Вопросы первого ряда
const firstRowQuestions = [
  {
    text: 'Как вы относитесь к музыке?',
    effects: { ear: 1 }
  },
  {
    text: 'Как вы относитесь к живописи?',
    effects: { eye: 1 }
  },
  {
    text: 'Как вы относитесь к вкусу и запаху пищи?',
    effects: { nose: 1 }
  }
];

// Вопросы второго ряда
const secondRowQuestions = [
  {
    text: 'Я помню происшедшее во всех деталях',
    effects: { picture: 1 }
  },
  {
    text: 'Я сразу упрощаю и помню только самое важное',
    effects: { scheme: 1 }
  },
  {
    text: 'Я составляю текст и работаю с текстом',
    effects: { text: 1 }
  }
];

// Вопросы третьего ряда
const thirdRowQuestions = [
  {
    text: 'Я ценю образы',
    effects: { images: 1 }
  },
  {
    text: 'Я работаю со сценариями',
    effects: { scenarios: 1 }
  },
  {
    text: 'Я ищу смыслы',
    effects: { meanings: 1 }
  }
];

// Вопросы четвертого ряда
const fourthRowQuestions = [
  {
    text: 'Я самый быстрый',
    effects: { choleric: 1 }
  },
  {
    text: 'Я самый чувствительный',
    effects: { melancholic: 1 }
  },
  {
    text: 'Я самый дружелюбный',
    effects: { sanguine: 1 }
  },
  {
    text: 'Я самый выносливый',
    effects: { phlegmatic: 1 }
  }
];

// Вопросы пятого ряда
const fifthRowQuestions = [
  {
    text: 'Я люблю отдыхать один в темноте глядя на пламя свечи',
    effects: { level1: 1 }
  },
  {
    text: 'Я сразу отделяю своих от чужих',
    effects: { level2: 1 }
  },
  {
    text: 'Я хочу всегда быть первым',
    effects: { level3: 1 }
  },
  {
    text: 'Я командный игрок',
    effects: { level4: 1 }
  },
  {
    text: 'Я люблю импровизировать',
    effects: { level5: 1 }
  },
  {
    text: 'Я люблю строгость рассуждений',
    effects: { level6: 1 }
  },
  {
    text: 'Я - изобретатель',
    effects: { level7: 1 }
  },
  {
    text: 'Я умею моделировать чужое сознание как неоднородное своему',
    effects: { level8: 1 }
  }
];

function checkDistribution(values: Record<string, number>, expected: { много: number, средне: number, мало: number }, fourthRowValues?: Record<string, number>): boolean {
  const counts = {
    много: 0,
    средне: 0,
    мало: 0
  };

  Object.values(values).forEach(value => {
    if (value === 1) counts.много++;
    else if (value === 0) counts.средне++;
    else counts.мало++;
  });

  // Если это пятый ряд и есть значения четвертого ряда
  if (fourthRowValues) {
    // Проверяем базовое распределение (2 много, 2 средне, остальные мало)
    if (counts.много !== 2 || counts.средне !== 2 || counts.мало !== 4) {
      return false;
    }

    // Получаем четные и нечетные уровни
    const evenLevels = ['level2', 'level4', 'level6', 'level8'];
    const oddLevels = ['level1', 'level3', 'level5', 'level7'];

    // Подсчитываем много/средне в четных и нечетных уровнях
    const evenHighCount = evenLevels.filter(level => values[level] === 1).length;
    const oddHighCount = oddLevels.filter(level => values[level] === 1).length;
    const evenMediumCount = evenLevels.filter(level => values[level] === 0).length;
    const oddMediumCount = oddLevels.filter(level => values[level] === 0).length;

    // Правило 1: Если много холерика или сангвиника, то много в нечетных уровнях
    if ((fourthRowValues.choleric === 1 || fourthRowValues.sanguine === 1) && oddHighCount !== 2) {
      return false;
    }

    // Правило 2: Если много флегматика или меланхолика, то много в четных уровнях
    if ((fourthRowValues.phlegmatic === 1 || fourthRowValues.melancholic === 1) && evenHighCount !== 2) {
      return false;
    }

    // Правило 3: Если средне холерика или сангвиника, то средне в нечетных уровнях
    if ((fourthRowValues.choleric === 0 || fourthRowValues.sanguine === 0) && oddMediumCount !== 2) {
      return false;
    }

    // Правило 4: Если средне флегматика или меланхолика, то средне в четных уровнях
    if ((fourthRowValues.phlegmatic === 0 || fourthRowValues.melancholic === 0) && evenMediumCount !== 2) {
      return false;
    }

    return true;
  }

  // Если это первый ряд, проверяем минимум одно значение каждого типа
  if (expected.много === 1 && expected.средне === 1 && expected.мало === 2 && !fourthRowValues) {
    return counts.много >= 1 && counts.средне >= 1 && counts.мало >= 1;
  }

  // Для четвертого ряда (темпераменты) строго: ровно 1 много, 1 средне, 2 мало
  if (fourthRowValues === undefined && Object.keys(values).length === 4) {
    // Debug: выводим распределение в консоль
    console.log('Темпераменты:', values, 'Counts:', counts);
    // Жесткая проверка: только 1 много, 1 средне, 2 мало
    if (counts.много !== 1 || counts.средне !== 1 || counts.мало !== 2) {
      return false;
    }
    // Дополнительно: запретить кнопку, если хоть одно значение не выбрано (например, undefined)
    if (Object.values(values).some(v => v !== 1 && v !== 0 && v !== -1)) {
      return false;
    }
    return true;
  }

  // Для остальных рядов используем стандартную проверку
  return counts.много === expected.много && 
         counts.средне === expected.средне && 
         counts.мало === expected.мало;
}

function getTemperamentLabel(value: number): string {
  return value === 1 ? 'много' : value === 0 ? 'средне' : 'мало';
}

function getDistributionRules(fourthRowValues: Record<string, number>): string {
  const rules = [];
  
  // Получаем значения темпераментов
  const choleric = getTemperamentLabel(fourthRowValues.choleric);
  const sanguine = getTemperamentLabel(fourthRowValues.sanguine);
  const phlegmatic = getTemperamentLabel(fourthRowValues.phlegmatic);
  const melancholic = getTemperamentLabel(fourthRowValues.melancholic);

  // Добавляем текущие значения
  rules.push(`Текущие значения темпераментов:`);
  rules.push(`Холерик: ${choleric}`);
  rules.push(`Сангвиник: ${sanguine}`);
  rules.push(`Флегматик: ${phlegmatic}`);
  rules.push(`Меланхолик: ${melancholic}`);
  rules.push(``);

  // Добавляем правила в зависимости от значений
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

const toNum = (v: string) => v === 'много' ? 1 : v === 'средне' ? 0 : -1;

export default function CardsApp() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(firstRow);
  const [secondValues, setSecondValues] = useState(secondRow);
  const [thirdValues, setThirdValues] = useState(thirdRow);
  const [fourthValues, setFourthValues] = useState(fourthRow);
  const [fifthValues, setFifthValues] = useState(fifthRow);
  const [showCorrection, setShowCorrection] = useState(false);
  const [currentRow, setCurrentRow] = useState<'first' | 'second' | 'third' | 'fourth' | 'fifth'>('first');

  // Всегда вычислять isValid на основе актуальных значений
  const isValid = currentRow === 'first'
    ? checkDistribution(values, { много: 1, средне: 1, мало: 2 })
    : currentRow === 'second'
    ? checkDistribution(secondValues, { много: 1, средне: 1, мало: 1 })
    : currentRow === 'third'
    ? checkDistribution(thirdValues, { много: 1, средне: 1, мало: 1 })
    : currentRow === 'fourth'
    ? (() => {
        const counts = { много: 0, средне: 0, мало: 0 };
        Object.values(fourthValues).forEach(v => {
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
      
      Object.entries(question.effects).forEach(([key]) => {
        updated[key as keyof typeof firstRow] = value;
      });

      setValues(updated);
      if (step + 1 < firstRowQuestions.length) {
        setStep(step + 1);
      } else {
        setShowCorrection(true);
      }
    } else if (currentRow === 'second') {
      const question = secondRowQuestions[step];
      const updated = { ...secondValues };
      
      Object.entries(question.effects).forEach(([key]) => {
        updated[key as keyof typeof secondRow] = value;
      });

      setSecondValues(updated);
      if (step + 1 < secondRowQuestions.length) {
        setStep(step + 1);
      } else {
        setShowCorrection(true);
      }
    } else if (currentRow === 'third') {
      const question = thirdRowQuestions[step];
      const updated = { ...thirdValues };
      
      Object.entries(question.effects).forEach(([key]) => {
        updated[key as keyof typeof thirdRow] = value;
      });

      setThirdValues(updated);
      if (step + 1 < thirdRowQuestions.length) {
        setStep(step + 1);
      } else {
        setShowCorrection(true);
      }
    } else if (currentRow === 'fourth') {
      const question = fourthRowQuestions[step];
      const updated = { ...fourthValues };
      
      Object.entries(question.effects).forEach(([key]) => {
        updated[key as keyof typeof fourthRow] = value;
      });

      setFourthValues(updated);
      if (step + 1 < fourthRowQuestions.length) {
        setStep(step + 1);
      } else {
        setShowCorrection(true);
      }
    } else {
      const question = fifthRowQuestions[step];
      const updated = { ...fifthValues };
      
      Object.entries(question.effects).forEach(([key]) => {
        updated[key as keyof typeof fifthRow] = value;
      });

      setFifthValues(updated);
      if (step + 1 < fifthRowQuestions.length) {
        setStep(step + 1);
      } else {
        setShowCorrection(true);
      }
    }
  };

  const handleValueChange = (key: string, value: string, row: 'first' | 'second' | 'third' | 'fourth' | 'fifth') => {
    if (row === 'first') {
      const updated = { ...values };
      updated[key as keyof typeof firstRow] = toNum(value);
      setValues(updated);
    } else if (row === 'second') {
      const updated = { ...secondValues };
      updated[key as keyof typeof secondRow] = toNum(value);
      setSecondValues(updated);
    } else if (row === 'third') {
      const updated = { ...thirdValues };
      updated[key as keyof typeof thirdRow] = toNum(value);
      setThirdValues(updated);
    } else if (row === 'fourth') {
      const updated = { ...fourthValues };
      updated[key as keyof typeof fourthRow] = toNum(value);
      setFourthValues(updated);
    } else {
      const updated = { ...fifthValues };
      updated[key as keyof typeof fifthRow] = toNum(value);
      setFifthValues(updated);
    }
  };

  const getValueLabel = (value: number): string => {
    return value === 1 ? 'много' : value === 0 ? 'средне' : 'мало';
  };

  const handleNext = () => {
    if (currentRow === 'first') {
      setCurrentRow('second');
    } else if (currentRow === 'second') {
      setCurrentRow('third');
    } else if (currentRow === 'third') {
      setCurrentRow('fourth');
    } else if (currentRow === 'fourth') {
      setCurrentRow('fifth');
    }
    setStep(0);
    setShowCorrection(false);
  };

  if (showCorrection) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Проверьте и при необходимости исправьте значения:</h3>
        {currentRow === 'first' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>
                Ухо:
                <select 
                  value={getValueLabel(values.ear)} 
                  onChange={(e) => handleValueChange('ear', e.target.value, 'first')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Глаз:
                <select 
                  value={getValueLabel(values.eye)} 
                  onChange={(e) => handleValueChange('eye', e.target.value, 'first')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Рука:
                <select 
                  value={getValueLabel(values.hand)} 
                  onChange={(e) => handleValueChange('hand', e.target.value, 'first')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Нос и язык:
                <select 
                  value={getValueLabel(values.nose)} 
                  onChange={(e) => handleValueChange('nose', e.target.value, 'first')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
          </>
        ) : currentRow === 'second' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>
                Картинка:
                <select 
                  value={getValueLabel(secondValues.picture)} 
                  onChange={(e) => handleValueChange('picture', e.target.value, 'second')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Схема:
                <select 
                  value={getValueLabel(secondValues.scheme)} 
                  onChange={(e) => handleValueChange('scheme', e.target.value, 'second')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Текст:
                <select 
                  value={getValueLabel(secondValues.text)} 
                  onChange={(e) => handleValueChange('text', e.target.value, 'second')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
          </>
        ) : currentRow === 'third' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>
                Образы:
                <select 
                  value={getValueLabel(thirdValues.images)} 
                  onChange={(e) => handleValueChange('images', e.target.value, 'third')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Сценарии:
                <select 
                  value={getValueLabel(thirdValues.scenarios)} 
                  onChange={(e) => handleValueChange('scenarios', e.target.value, 'third')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Смыслы:
                <select 
                  value={getValueLabel(thirdValues.meanings)} 
                  onChange={(e) => handleValueChange('meanings', e.target.value, 'third')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
          </>
        ) : currentRow === 'fourth' ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>
                Холерик:
                <select 
                  value={getValueLabel(fourthValues.choleric)} 
                  onChange={(e) => handleValueChange('choleric', e.target.value, 'fourth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Сангвиник:
                <select 
                  value={getValueLabel(fourthValues.sanguine)} 
                  onChange={(e) => handleValueChange('sanguine', e.target.value, 'fourth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Флегматик:
                <select 
                  value={getValueLabel(fourthValues.phlegmatic)} 
                  onChange={(e) => handleValueChange('phlegmatic', e.target.value, 'fourth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Меланхолик:
                <select 
                  value={getValueLabel(fourthValues.melancholic)} 
                  onChange={(e) => handleValueChange('melancholic', e.target.value, 'fourth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 1:
                <select 
                  value={getValueLabel(fifthValues.level1)} 
                  onChange={(e) => handleValueChange('level1', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 2:
                <select 
                  value={getValueLabel(fifthValues.level2)} 
                  onChange={(e) => handleValueChange('level2', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 3:
                <select 
                  value={getValueLabel(fifthValues.level3)} 
                  onChange={(e) => handleValueChange('level3', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 4:
                <select 
                  value={getValueLabel(fifthValues.level4)} 
                  onChange={(e) => handleValueChange('level4', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 5:
                <select 
                  value={getValueLabel(fifthValues.level5)} 
                  onChange={(e) => handleValueChange('level5', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 6:
                <select 
                  value={getValueLabel(fifthValues.level6)} 
                  onChange={(e) => handleValueChange('level6', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 7:
                <select 
                  value={getValueLabel(fifthValues.level7)} 
                  onChange={(e) => handleValueChange('level7', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>
                Уровень 8:
                <select 
                  value={getValueLabel(fifthValues.level8)} 
                  onChange={(e) => handleValueChange('level8', e.target.value, 'fifth')}
                >
                  <option value="много">много</option>
                  <option value="средне">средне</option>
                  <option value="мало">мало</option>
                </select>
              </label>
            </div>
          </>
        )}
        {isValid && (
          <button 
            onClick={currentRow === 'fifth' ? () => alert('Работа завершена!') : handleNext}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            {currentRow === 'fifth' ? 'ГОТОВО' : 'ДАЛЬШЕ'}
          </button>
        )}
        {!isValid && (
          <div style={{ color: 'red' }}>
            {currentRow === 'first'
              ? 'Пожалуйста, исправьте значения так, чтобы было хотя бы одно "много", хотя бы одно "средне" и хотя бы одно "мало"'
              : currentRow === 'fourth'
              ? 'Пожалуйста, исправьте значения так, чтобы было ровно одно "много", ровно одно "средне" и два "мало"'
              : currentRow === 'fifth'
              ? (
                <>
                  <p>Пожалуйста, исправьте значения так, чтобы было: много - 2 раза, средне - 2 раза, мало - 4 раза.</p>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginTop: '10px'
                  }}>
                    {getDistributionRules(fourthValues)}
                  </pre>
                </>
              )
              : 'Пожалуйста, исправьте значения так, чтобы было: много - 1 раз, средне - 1 раз, мало - 1 раз'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {currentRow === 'first' ? (
        step < firstRowQuestions.length ? (
          <div>
            <h2 style={{ fontSize: '24px' }}>{firstRowQuestions[step].text}</h2>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(1)}>Люблю</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(0)}>Не знаю</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(-1)}>Равнодушен</button>
          </div>
        ) : null
      ) : currentRow === 'second' ? (
        step < secondRowQuestions.length ? (
          <div>
            <h2 style={{ fontSize: '24px' }}>{secondRowQuestions[step].text}</h2>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(1)}>Да</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(0)}>Не знаю</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(-1)}>Нет</button>
          </div>
        ) : null
      ) : currentRow === 'third' ? (
        step < thirdRowQuestions.length ? (
          <div>
            <h2 style={{ fontSize: '24px' }}>{thirdRowQuestions[step].text}</h2>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(1)}>Да</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(0)}>Не знаю</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(-1)}>Нет</button>
          </div>
        ) : null
      ) : currentRow === 'fourth' ? (
        step < fourthRowQuestions.length ? (
          <div>
            <h2 style={{ fontSize: '24px' }}>{fourthRowQuestions[step].text}</h2>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(1)}>Да</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(0)}>Не знаю</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(-1)}>Нет</button>
          </div>
        ) : null
      ) : (
        step < fifthRowQuestions.length ? (
          <div>
            <h2 style={{ fontSize: '24px' }}>{fifthRowQuestions[step].text}</h2>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(1)}>Да</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(0)}>Не знаю</button>
            <button style={{ fontSize: '18px', margin: '10px', padding: '10px 20px' }} onClick={() => handleAnswer(-1)}>Нет</button>
          </div>
        ) : null
      )}
    </div>
  );
}
