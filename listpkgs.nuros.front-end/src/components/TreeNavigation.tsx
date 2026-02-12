import { createSignal, For, Show, Switch, Match } from 'solid-js';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  count?: number;
}

interface TreeNavigationProps {
  nodes: TreeNode[];
  onSelect: (nodeId: string) => void;
  selectedNode?: string;
}

const TreeNavigation = (props: TreeNavigationProps) => {
  const [expandedNodes, setExpandedNodes] = createSignal<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes());
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const isExpanded = (nodeId: string) => expandedNodes().has(nodeId);

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

interface TreeNodeComponentProps {
  node: TreeNode;
  onSelect: (nodeId: string) => void;
  selectedNode?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const TreeNodeComponent = (props: TreeNodeComponentProps) => {
  const hasChildren = () => !!props.node.children && props.node.children!.length > 0;

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

export default TreeNavigation;