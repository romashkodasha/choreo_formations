export const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Проект 1',
    team: {
      id: 1,
      name: 'Котики',
      members: [
        {
          id: 1,
          name: 'Вася',
          color: '#ff0000',
        },
        {
          id: 2,
          name: 'Петя',
          color: '#00ff00',
        },
        {
          id: 3,
          name: 'Мурзик',
          color: '#0000ff',
        },
      ],
    },
    width: 12,
    height: 11,
  },
  {
    id: 2,
    name: 'Проект 2',
    team: {
      id: 2,
      name: 'Собачки',
      members: [
        {
          id: 3,
          name: 'Мурзик',
          color: '#0000ff',
        },
        {
          id: 4,
          name: 'Барбос',
          color: '#ffff00',
        },
      ],
    },
    width: 10,
    height: 8,
  },
  {
    id: 3,
    name: 'Проект 3',
    team: {
      id: 3,
      name: 'Хомячки',
      members: [
        {
          id: 5,
          name: 'Рыжик',
          color: '#ff8000',
        },
        {
          id: 6,
          name: 'Белка',
          color: '#008000',
        },
      ],
    },
    width: 15,
    height: 9,
  },
  {
    id: 4,
    name: 'Проект 4',
    team: {
      id: 4,
      name: 'Рыбки',
      members: [
        {
          id: 7,
          name: 'Немо',
          color: '#000000',
        },
        {
          id: 8,
          name: 'Дори',
          color: '#ff00ff',
        },
      ],
    },
    width: 9,
    height: 13,
  },
  {
    id: 5,
    name: 'Проект 5',
    team: {
      id: 5,
      name: 'Птички',
      members: [
        {
          id: 9,
          name: 'Чижик',
          color: '#800080',
        },
        {
          id: 10,
          name: 'Синичка',
          color: '#008080',
        },
      ],
    },
    width: 11,
    height: 7,
  },
];

export const MOCK_PROJECTS_DETAILS = [
  {
    id: 1,
    name: 'Проект 1',
    team: {
      id: 1,
      name: 'Котики',
      members: [
        {
          id: 1,
          name: 'Вася',
          color: '#ff0000',
        },
        {
          id: 2,
          name: 'Петя',
          color: '#00ff00',
        },
        {
          id: 3,
          name: 'Мурзик',
          color: '#0000ff',
        },
      ],
    },
    width: 12,
    height: 11,
    formations: [
      {
        id: 1,
        sequenceNumber: 1,
        timeStart: '00:00',
        timeEnd: '00:05',
        positions: [
          {
            id: 1,
            dancerId: 1,
            name: 'Вася',
            color: '#ff0000',
            positionX: 10,
            positionY: 20,
          },
          {
            id: 2,
            dancerId: 2,
            name: 'Петя',
            color: '#00ff00',
            positionX: 30,
            positionY: 40,
          },
          {
            id: 3,
            dancerId: 3,
            name: 'Мурзик',
            color: '#0000ff',
            positionX: 40,
            positionY: 40,
          },
        ],
      },
      {
        id: 2,
        sequenceNumber: 2,
        timeStart: '00:10',
        timeEnd: '00:20',
        positions: [
          {
            id: 4,
            dancerId: 1,
            name: 'Вася',
            color: '#ff0000',
            positionX: 20,
            positionY: 20,
          },
          {
            id: 5,
            dancerId: 2,
            name: 'Петя',
            color: '#00ff00',
            positionX: 40,
            positionY: 40,
          },
          {
            id: 6,
            dancerId: 3,
            name: 'Мурзик',
            color: '#0000ff',
            positionX: 50,
            positionY: 40,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Проект 2',
    team: {
      id: 2,
      name: 'Собачки',
      members: [
        {
          id: 3,
          name: 'Мурзик',
          color: '#0000ff',
        },
        {
          id: 4,
          name: 'Барбос',
          color: '#ffff00',
        },
      ],
    },
    width: 10,
    height: 8,
  },
  {
    id: 3,
    name: 'Проект 3',
    team: {
      id: 3,
      name: 'Хомячки',
      members: [
        {
          id: 5,
          name: 'Рыжик',
          color: '#ff8000',
        },
        {
          id: 6,
          name: 'Белка',
          color: '#008000',
        },
      ],
    },
    width: 15,
    height: 9,
  },
  {
    id: 4,
    name: 'Проект 4',
    team: {
      id: 4,
      name: 'Рыбки',
      members: [
        {
          id: 7,
          name: 'Немо',
          color: '#000000',
        },
        {
          id: 8,
          name: 'Дори',
          color: '#ff00ff',
        },
      ],
    },
    width: 9,
    height: 13,
  },
  {
    id: 5,
    name: 'Проект 5',
    team: {
      id: 5,
      name: 'Птички',
      members: [
        {
          id: 9,
          name: 'Чижик',
          color: '#800080',
        },
        {
          id: 10,
          name: 'Синичка',
          color: '#008080',
        },
      ],
    },
    width: 11,
    height: 7,
  },
];
