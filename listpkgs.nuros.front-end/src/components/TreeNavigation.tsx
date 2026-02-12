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
 */
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
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
          {(node) => (
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
   * @brief Рендеринг компонента узла
   * @details Возвращает JSX элемент узла дерева с кнопками управления
   */
  return (
    <li class="tree-node">
      <div class={`tree-node-header ${props.selectedNode === props.node.id ? 'selected' : ''}`}>
        <button
          class="tree-node-toggle"
          onClick={props.onToggle}
          disabled={!hasChildren()}
        >
          <Switch>
            <Match when={hasChildren()}>
              {props.isExpanded ? '▼' : '▶'}
            </Match>
            <Match when={!hasChildren()}>
              <span class="spacer" />
            </Match>
          </Switch>
        </button>
        <button
          class="tree-node-label"
          onClick={() => props.onSelect(props.node.id)}
        >
          {props.node.label}
          <Switch>
            <Match when={props.node.count !== undefined}>
              <span class="node-count">({props.node.count})</span>
            </Match>
          </Switch>
        </button>
      </div>

      <Show when={hasChildren() && props.isExpanded}>
        <ul class="tree-children">
          <For each={props.node.children}>
            {(child) => (
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