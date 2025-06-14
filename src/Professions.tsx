import React, { useState } from 'react';

// Порядок параметров для карты личности и профессий
export const personalityKeys = [
  'ear', 'eye', 'hand', 'nose',
  'picture', 'scheme', 'text',
  'images', 'scenarios', 'meanings',
  'choleric', 'sanguine', 'phlegmatic', 'melancholic',
  'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8'
];

// Карты профессий: массивы чисел в том же порядке, что personalityKeys
export const professionMaps: Record<string, number[]> = {
  'Программист': [0, 0, 1, -1,
     1, 0, 1, 
     0, 1, 1,
      1, 1, 1, 0,
       0, 0, 1, 0, 0, 1, 1, 0],
  'Дизайнер':    [-1, 1, 1, 0,
     0, 1, 0, 
     1, 0, 0,
      0, 1, 1, 1,
       0, 1, 0, 0, 1, -1, 0, 1],
  'Учитель':     [1, 1, 0, 0,
     1, 0, 0,
      0, 1, 1,
       1, 0, 1, 0, 
       -1, 0, 1, 1, 1, 0, 0, 0],
  'Врач':        [1, 1, 1, -1,
    1, 1, 0,
      0, 1, 1,
       1, 0, 1, 0,
        1, 0, 0, 1, 1, 0, 0, 0],
  'Инженер':     [0, 1, 1, 0,
     0, 1, 1,
      0, 1, 1, 
      0, 1, 1, 0, 
      -1, -1, 0, 1, 1, 1, 0, 0]
};

const professionsList = Object.keys(professionMaps);

const valueStyles: Record<'много' | 'средне' | 'мало', React.CSSProperties> = {
  'много': { backgroundColor: '#90EE90', padding: '10px', borderRadius: '4px' },
  'средне': { backgroundColor: '#FFD700', padding: '10px', borderRadius: '4px' },
  'мало': { backgroundColor: '#FFB6C1', padding: '10px', borderRadius: '4px' }
};

function getValueLabel(value: number): 'много' | 'средне' | 'мало' {
  return value === 1 ? 'много' : value === 0 ? 'средне' : 'мало';
}

interface ProfessionsProps {
  onHome: () => void;
  compareMode?: boolean;
  userMap?: any;
}

export default function Professions({ onHome, compareMode, userMap }: ProfessionsProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<null | Array<{
    profession: string;
    pairs: [number, number, number];
  }>>(null);

  const handleCheck = (prof: string) => {
    setSelected(selected =>
      selected.includes(prof)
        ? selected.filter(p => p !== prof)
        : [...selected, prof]
    );
  };

  // Сравнение карты пользователя с картой профессии
  const compareWithProfessions = () => {
    if (!userMap) return;
    const userArr = personalityKeys.map(key => userMap[key]);
    const result = selected.map(prof => {
      const profArr = professionMaps[prof];
      let pair1 = 0, pair2 = 0, pair3 = 0;
      for (let i = 0; i < userArr.length && i < profArr.length; i++) {
        if (userArr[i] === 1 && profArr[i] === -1) pair1++;
        if (userArr[i] === -1 && profArr[i] === 1) pair2++;
        if (userArr[i] === 1 && profArr[i] === 1) pair3++;
      }
      return {
        profession: prof,
        pairs: [pair1, pair2, pair3] as [number, number, number]
      };
    });
    setCompareResult(result);
  };

  return (
    <div className="app-container">
      <h2>Профессии</h2>
      <button className="next-button" style={{ marginBottom: 20 }} onClick={onHome}>ДОМОЙ</button>
      <div style={{ marginBottom: 30 }}>
        {professionsList.map(prof => (
          <label key={prof} style={{ display: 'block', fontSize: '1.2em', margin: '8px 0' }}>
            <input
              type="checkbox"
              checked={selected.includes(prof)}
              onChange={() => handleCheck(prof)}
              style={{ marginRight: 10 }}
              disabled={!!compareResult}
            />
            {prof}
          </label>
        ))}
      </div>
      {!compareResult && selected.length > 0 && (
        <button
          className="next-button"
          style={{ marginBottom: 30 }}
          onClick={compareWithProfessions}
          disabled={!userMap}
        >
          ВЫЧИСЛИТЬ
        </button>
      )}
      {compareResult && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30, textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Профессия</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>БЛОК</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>НЕУСПЕХ</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>УСПЕХ</th>
              </tr>
            </thead>
            <tbody>
              {compareResult.map(row => (
                <tr key={row.profession}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.profession}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.pairs[0]}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.pairs[1]}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.pairs[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="next-button"
            style={{ marginBottom: 30 }}
            onClick={() => setCompareResult(null)}
          >
            Назад к выбору
          </button>
        </>
      )}
    </div>
  );
} 