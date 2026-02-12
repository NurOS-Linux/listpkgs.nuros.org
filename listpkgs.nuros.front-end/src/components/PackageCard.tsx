import { createSignal } from 'solid-js';
import { Switch, Match } from 'solid-js';
import JsonDisplay from './JsonDisplay';

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
  [key: string]: any;
}

interface PackageCardProps {
  packageData: Package;
}

const PackageCard = (props: PackageCardProps) => {
  const [showDetails, setShowDetails] = createSignal(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails());
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
        <span class="package-architecture">Architecture: {props.packageData.architecture || 'N/A'}</span>
        <span class="package-maintainer">Maintainer: {props.packageData.maintainer || 'Unknown'}</span>
        <span class="package-updated">Last Updated: {formatDate(props.packageData._last_updated)}</span>
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

export default PackageCard;
export type { Package };