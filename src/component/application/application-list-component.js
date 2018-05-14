import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Card } from 'react-mdl';
import { AppsLinkList } from '../common';
import '../common/common.css';

class ClientStrategies extends Component {
    static propTypes = {
        applications: PropTypes.array,
        fetchAll: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.fetchAll();
    }

    render() {
        const { applications } = this.props;

        if (!applications) {
            return <ProgressBar indeterminate />;
        }
        return (
            <Card className={'fullwidth'}>
                <AppsLinkList apps={applications} />
            </Card>
        );
    }
}

export default ClientStrategies;
