import React from 'react';
import PropTypes from 'prop-types';
import styles from './user.css';

export default class ShowUserComponent extends React.Component {
    static propTypes = {
        profile: PropTypes.object,
        location: PropTypes.object,
        fetchUser: PropTypes.func.isRequired,
        updateSettingLocation: PropTypes.func.isRequired,
    };
    possibleLocales = [
        { value: 'nb-NO', image: 'nb-NO' },
        { value: 'us-US', image: 'us-US' },
        { value: 'en-GB', image: 'en-GB' },
    ];

    componentDidMount() {
        this.props.fetchUser();
        // find default locale and add it in choices if not present
        let locale = navigator.language;
        let found = this.possibleLocales.find(l => l.value === locale);
        if (!found) {
            this.possibleLocales.push({ value: locale, image: 'unknown-locale' });
        }
    }

    updateLocale() {
        const locale = this.props.location
            ? this.props.location.locale
            : this.possibleLocales[this.possibleLocales.length - 1];
        let index = this.possibleLocales.findIndex(v => v.value === locale);
        index = (index + 1) % this.possibleLocales.length;
        this.props.updateSettingLocation('locale', this.possibleLocales[index].value);
    }

    render() {
        const email = this.props.profile ? this.props.profile.email : '';
        const locale = this.props.location
            ? this.props.location.locale
            : this.possibleLocales[this.possibleLocales.length - 1].value;
        let foundLocale = this.possibleLocales.find(l => l.value === locale);
        const imageUrl = email ? this.props.profile.imageUrl : 'public/unknown-user.png';
        const imageLocale = foundLocale ? `public/${foundLocale.image}.png` : `public/unknown-locale.png`;
        return (
            <div className={styles.showUserSettings}>
                <div className={styles.showLocale}>
                    <img src={imageLocale} title={locale} alt={locale} onClick={this.updateLocale.bind(this)} />
                </div>&nbsp;
                <div className={styles.showUser}>
                    <img src={imageUrl} title={email} alt={email} />
                </div>
            </div>
        );
    }
}
