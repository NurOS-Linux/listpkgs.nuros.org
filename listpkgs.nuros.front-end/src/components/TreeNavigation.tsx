/**
 * @file TreeNavigation.tsx
 * @brief Компонент древовидной навигации для фильтрации пакетов
 * @author NurOS Team
 * @version 1.0
 */

import { createSignal, For, Show, Switch, Match } from 'solid-js';

/**
 * @interface TreeNode
 * @brief Интерфейс узла дерева навигации
 * @property {string} id - Уникальный идентификатор узла
 * @property {string} label - Текстовое представление узла
 * @property {TreeNode[]} [children] - Дочерние узлы
 * @property {number} [count] - Количество элементов в узле
 * @property {string} [sortField] - Поле, по которому сортируются дочерние элементы
 */
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
  sortField?: string;
}

/**
 * @interface TreeNavigationProps
 * @brief Интерфейс свойств компонента TreeNavigation
 * @property {TreeNode[]} nodes - Массив узлов дерева
 * @property {Function} onSelect - Функция для обработки выбора узла
 * @property {string} [selectedNode] - Идентификатор выбранного узла
 */
interface TreeNavigationProps {
  nodes: TreeNode[];
  onSelect: (nodeId: string) => void;
  selectedNode?: string;
}

/**
 * @brief Компонент древовидной навигации
 * @details Отображает иерархическую структуру узлов для навигации и фильтрации
 * @param {TreeNavigationProps} props - Свойства компонента
 * @returns JSX.Element - Компонент древовидной навигации
 */
const TreeNavigation = (props: TreeNavigationProps) => {
  const [expandedNodes, setExpandedNodes] = createSignal<Set<string>>(new Set());

  /**
   * @brief Переключение состояния узла (развернут/свернут)
   * @param {string} nodeId - Идентификатор узла
   */
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes());
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  /**
   * @brief Проверка, развернут ли узел
   * @param {string} nodeId - Идентификатор узла
   * @returns {boolean} - Состояние развернутости узла
   */
  const isExpanded = (nodeId: string) => expandedNodes().has(nodeId);

  /**
   * @brief Рендеринг компонента
   * @details Возвращает JSX элемент с древовидной структурой навигации
   */
  return (
    <nav class="tree-navigation">
      <ul class="tree-root">
        <For each={props.nodes}>
          {node => (
            <TreeNodeComponent
              node={node}
              onSelect={props.onSelect}
              selectedNode={props.selectedNode}
              isExpanded={isExpanded(node.id)}
              onToggle={() => toggleNode(node.id)}
            />
          )}
        </For>
      </ul>
    </nav>
  );
};

/**
 * @interface TreeNodeComponentProps
 * @brief Интерфейс свойств компонента узла дерева
 * @property {TreeNode} node - Данные узла
 * @property {Function} onSelect - Функция для обработки выбора узла
 * @property {string} [selectedNode] - Идентификатор выбранного узла
 * @property {boolean} isExpanded - Состояние развернутости узла
 * @property {Function} onToggle - Функция для переключения состояния узла
 */
interface TreeNodeComponentProps {
  node: TreeNode;
  onSelect: (nodeId: string) => void;
  selectedNode?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * @brief Компонент узла дерева навигации
 * @details Отображает один узел дерева с возможностью развертывания и выбора
 * @param {TreeNodeComponentProps} props - Свойства компонента
 * @returns JSX.Element - Компонент узла дерева
 */
const TreeNodeComponent = (props: TreeNodeComponentProps) => {
  /**
   * @brief Проверка наличия дочерних узлов
   * @returns {boolean} - Наличие дочерних узлов
   */
  const hasChildren = () => !!props.node.children && props.node.children!.length > 0;

  /**
   * @brief Функция сортировки дочерних узлов по заданному полю
   * @returns {TreeNode[]} - Отсортированный массив дочерних узлов
   */
  const sortedChildren = () => {
    if (!props.node.children) return [];

    // Если задано поле сортировки, сортируем по нему
    if (props.node.sortField) {
      // eslint-disable-next-line solid/reactivity
      return [...props.node.children].sort((a, b) => {
        // Получаем значения полей для сравнения
        const aValue = a[props.node.sortField as keyof TreeNode];
        const bValue = b[props.node.sortField as keyof TreeNode];

        // Сравниваем значения
        if (aValue && bValue) {
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue);
          } else {
            return (aValue as number) - (bValue as number);
          }
        }
        return 0;
      });
    }

    // Если поле сортировки не задано, возвращаем оригинальный порядок
    return props.node.children;
  };

  /**
   * @brief Рендеринг компонента узла
   * @details Возвращает JSX элемент узла дерева с чекбоксами
   */
  return (
    <li class="tree-node">
      <div class={`tree-node-header ${props.selectedNode === props.node.id ? 'selected' : ''}`}>
        <button
          class="tree-node-toggle"
          onClick={() => props.onToggle?.()}
          disabled={!hasChildren()}
        >
          <Switch>
            <Match when={hasChildren()}>{props.isExpanded ? '▼' : '▶'}</Match>
            <Match when={!hasChildren()}>
              <span class="spacer" />
            </Match>
          </Switch>
        </button>
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            id={props.node.id}
            checked={props.selectedNode === props.node.id}
            onChange={() => props.onSelect(props.node.id)}
          />
          <label for={props.node.id} class="tree-node-label">
            {props.node.label}
            <Switch>
              <Match when={props.node.count !== undefined}>
                <span class="node-count">({props.node.count})</span>
              </Match>
            </Switch>
          </label>
          <span class="checkmark" />
        </div>
      </div>

      <Show when={hasChildren() && props.isExpanded}>
        <ul class="tree-children">
          <For each={sortedChildren()}>
            {child => (
              <TreeNodeComponent
                node={child}
                onSelect={props.onSelect}
                selectedNode={props.selectedNode}
                isExpanded={props.isExpanded}
                onToggle={() => {}}
              />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
};

/**
 * @brief Экспорт компонента TreeNavigation
 * @details Экспортирует компонент по умолчанию
 */
export default TreeNavigation;
