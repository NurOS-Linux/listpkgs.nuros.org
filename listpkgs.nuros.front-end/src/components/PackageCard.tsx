/**
 * @file PackageCard.tsx
 * @brief Компонент карточки пакета для отображения информации о пакете
 * @author NurOS Team
 * @version 1.0
 */

import { createSignal } from 'solid-js';
import { Switch, Match } from 'solid-js';
import JsonDisplay from './JsonDisplay';

/**
 * @interface Package
 * @brief Интерфейс данных пакета
 * @property {string} name - Название пакета
 * @property {string} version - Версия пакета
 * @property {string} [type] - Тип пакета
 * @property {string | null} [architecture] - Архитектура пакета
 * @property {string} [description] - Описание пакета
 * @property {string} [maintainer] - Мейнтейнер пакета
 * @property {string | null} [license] - Лицензия пакета
 * @property {string} [homepage] - Домашняя страница пакета
 * @property {string[]} [dependencies] - Зависимости пакета
 * @property {string[]} [conflicts] - Конфликты пакета
 * @property {string} [_source_repo] - Репозиторий источника
 * @property {string} [_last_updated] - Дата последнего обновления
 */
interface Package {
  name: string;
  version: string;
  type?: string;
  architecture?: string | null;
  description?: string;
  maintainer?: string;
  license?: string | null;
  homepage?: string;
  dependencies?: string[];
  conflicts?: string[];
  _source_repo?: string;
  _last_updated?: string;
  [key: string]: unknown;
}

/**
 * @interface PackageCardProps
 * @brief Интерфейс свойств компонента PackageCard
 * @property {Package} packageData - Данные пакета для отображения
 */
interface PackageCardProps {
  packageData: Package;
}

/**
 * @brief Компонент карточки пакета
 * @details Отображает информацию о пакете, включая название, версию, архитектуру, мейнтейнера и другие данные
 * @param {PackageCardProps} props - Свойства компонента
 * @returns JSX.Element - Компонент карточки пакета
 */
const PackageCard = (props: PackageCardProps) => {
  const [showDetails, setShowDetails] = createSignal(false);

  /**
   * @brief Переключение отображения деталей пакета
   * @details Изменяет состояние показа полной информации о пакете
   */
  const toggleDetails = () => {
    setShowDetails(!showDetails());
  };

  /**
   * @brief Форматирование даты
   * @details Преобразует строку даты в локализованный формат
   * @param {string | undefined} dateString - Строка даты для форматирования
   * @returns {string} - Отформатированная дата или 'N/A'
   */
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  /**
   * @brief Рендеринг компонента
   * @details Возвращает JSX элемент с информацией о пакете
   */
  return (
    <div class="package-card">
      <div class="package-header">
        <h3 class="package-name">
          {props.packageData.name}
          <small class="package-version">v{props.packageData.version}</small>
        </h3>
        <button class="toggle-details-btn" onClick={toggleDetails}>
          {showDetails() ? 'Скрыть детали' : 'Показать JSON'}
        </button>
      </div>

      <div class="package-meta">
        <span class="package-architecture">
          Architecture: {props.packageData.architecture || 'N/A'}
        </span>
        <span class="package-maintainer">
          Maintainer: {props.packageData.maintainer || 'Unknown'}
        </span>
        <span class="package-updated">
          Last Updated: {formatDate(props.packageData._last_updated)}
        </span>
      </div>

      <div class="package-description">
        {props.packageData.description ? props.packageData.description : 'No description available'}
      </div>

      <div class="package-links">
        <a href={props.packageData._source_repo} target="_blank" rel="noopener noreferrer">
          Repository
        </a>
        <Switch>
          <Match when={props.packageData.license}>
            <span class="package-license">License: {props.packageData.license}</span>
          </Match>
        </Switch>
      </div>

      <Switch>
        <Match when={showDetails()}>
          <div class="package-details">
            <JsonDisplay data={props.packageData} />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

/**
 * @brief Экспорт компонента PackageCard
 * @details Экспортирует компонент по умолчанию и тип Package
 */
export default PackageCard;
export type { Package };
