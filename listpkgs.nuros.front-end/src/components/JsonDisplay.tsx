/**
 * @file JsonDisplay.tsx
 * @brief Компонент для отображения JSON с подсветкой синтаксиса
 * @author NurOS Team
 * @version 1.0
 */

import { onMount } from 'solid-js';
import { Switch, Match } from 'solid-js';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

/**
 * @interface JsonDisplayProps
 * @brief Интерфейс свойств компонента JsonDisplay
 * @property {any} data - Данные для отображения в формате JSON
 */
interface JsonDisplayProps {
  data: any;
}

/**
 * @brief Компонент для отображения JSON с подсветкой синтаксиса
 * @details Использует библиотеку Prism.js для подсветки синтаксиса JSON
 * @param {JsonDisplayProps} props - Свойства компонента
 * @returns JSX.Element - Компонент для отображения JSON
 */
const JsonDisplay = (props: JsonDisplayProps) => {
  let ref: HTMLPreElement | undefined;

  /**
   * @brief Эффект при монтировании компонента
   * @details Инициализирует подсветку синтаксиса для JSON данных
   */
  onMount(() => {
    if (ref) {
      // Удаляем предыдущее содержимое
      ref.innerHTML = '';

      // Создаем код элемент
      const codeElement = document.createElement('code');
      codeElement.className = 'language-json';

      // Преобразуем данные в форматированный JSON
      const jsonString = JSON.stringify(props.data, null, 2);
      codeElement.textContent = jsonString;

      // Добавляем код в элемент
      ref.appendChild(codeElement);

      // Выполняем подсветку синтаксиса
      Prism.highlightElement(codeElement);
    }
  });

  /**
   * @brief Рендеринг компонента
   * @details Возвращает JSX элемент с подсветкой синтаксиса JSON
   */
  return (
    <pre ref={ref} class="json-display-prism">
      {/* Используем Switch для демонстрации возможностей, хотя в данном случае он не нужен */}
      <Switch fallback={<code>{JSON.stringify(props.data, null, 2)}</code>}>
        <Match when={typeof props.data === 'object'}>
          <code>{JSON.stringify(props.data, null, 2)}</code>
        </Match>
      </Switch>
    </pre>
  );
};

/**
 * @brief Экспорт компонента JsonDisplay
 * @details Экспортирует компонент по умолчанию
 */
export default JsonDisplay;