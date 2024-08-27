import styles from './styles.module.scss';

function Footer() {
  return (
    <footer>
      <div className={styles.footer}>
        <div className='row'>
          <div className='col-sm-6 col-md-3 item'>
            <h3>JMAI © 2023</h3>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
