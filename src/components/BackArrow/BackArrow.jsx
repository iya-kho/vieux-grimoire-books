import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

function BackArrow() {
  return (
    <Link to="/" className="backArrow">
      {' '}
      <FontAwesomeIcon icon={solid('arrow-left')} />
      {' Retour'}
    </Link>
  );
}

export default BackArrow;
