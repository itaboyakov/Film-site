module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': 'eslint:recommended',
    'overrides': [
        {
            'env': {
                'node': true,
            },
            'files': [
                '.eslintrc.{js,cjs}',
            ],
            'parserOptions': {
                'sourceType': 'script',
            },
        },
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'rules': {
        'linebreak-style': 0,
        'no-console': 0,
        quotes: [2, 'single', { avoidEscape: true }],
        'consistent-return': 0,
        semi: ['error', 'always'], // точка с запятой в конце операторов
        indent: ['error', 4, { SwitchCase: 1 }], // отступы в коде из 4 пробелов с учетом switch...case
        'arrow-parens': ['error', 'as-needed'], // скобки вокруг единственного параметра стрелочной функции
        'object-curly-spacing': ['error', 'always'], // пробелы между скобками в литералах объектов
        'array-bracket-spacing': ['error', 'never'], // пробелы между скобками в массивах
        'no-trailing-spaces': 'error', // не должно быть пробелов в конце строки
        'no-tabs': 'error', // символы табуляции в коде запрещена везде
        'comma-dangle': ['error', { // запятая после последнего элемента массива или объекта
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'never',
            exports: 'never',
            functions: 'never',
        }],
        'brace-style': ['error', '1tbs'], // правила для фигурных скобкок для блоков кода
        'keyword-spacing': 'error', // пробел слева и справа для ключевых слов
        'no-multi-spaces': 'error', // не допускается несколько пробелов подряд
        camelcase: 'error', // имена переменных и функций в стиле camelCase
        'max-len': ['error', 150], // максимальная длина строки
        'no-multiple-empty-lines': 'error', // не больше 2 пустых строк подряд
        'no-unused-vars': 'warn',
    },
};
