import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Switch, Chip, ListItem, ListItemAction, Icon } from 'react-mdl';
import Progress from './progress';
import { calc } from '../common';
import '../common/common.css';
import './feature.css';
import { ListView, Row } from 'patternfly-react';

const PATTERNFLY = false;

const renderPatternfly = (feature, functionToToggle) => (
    <ListView>
        <ListView.GroupItem stacked expanded>
            <ListView.GroupItemHeader toggleExpanded={functionToToggle}>
                {' '}
                // required only if the ListViewGroupItem is supposed to be expandable
                <ListView.Expand expanded />
                <ListView.Checkbox />
                <ListView.MainInfo>
                    <ListView.Left>
                        <ListView.Icon size="sm" name="flask" />
                    </ListView.Left>
                    <ListView.Body>
                        <ListView.Description>
                            <ListView.DescriptionHeading>{feature.name}</ListView.DescriptionHeading>
                            <ListView.DescriptionText>{feature.description}</ListView.DescriptionText>
                        </ListView.Description>
                        <ListView.AdditionalInfo>
                            <ListView.InfoItem>
                                <ListView.Icon type="pf" name="flavor" />
                                {feature.name}
                            </ListView.InfoItem>
                        </ListView.AdditionalInfo>
                    </ListView.Body>
                </ListView.MainInfo>
            </ListView.GroupItemHeader>

            <ListView.GroupItemContainer onClose={functionToToggle} expanded>
                <Row>Some content goes here</Row>
            </ListView.GroupItemContainer>
        </ListView.GroupItem>
    </ListView>
);
const Feature = ({
    feature,
    toggleFeature,
    settings,
    metricsLastHour = { yes: 0, no: 0, isFallback: true },
    metricsLastMinute = { yes: 0, no: 0, isFallback: true },
    revive,
}) => {
    const { name, description, enabled, strategies } = feature;
    const { showLastHour = false } = settings;
    const isStale = showLastHour ? metricsLastHour.isFallback : metricsLastMinute.isFallback;
    const percent =
        1 *
        (showLastHour
            ? calc(metricsLastHour.yes, metricsLastHour.yes + metricsLastHour.no, 0)
            : calc(metricsLastMinute.yes, metricsLastMinute.yes + metricsLastMinute.no, 0));

    const strategiesToShow = Math.min(strategies.length, 3);
    const remainingStrategies = strategies.length - strategiesToShow;
    const strategyChips =
        strategies &&
        strategies.slice(0, strategiesToShow).map((s, i) => (
            <Chip className={'strategyChip'} key={i}>
                {s.name}
            </Chip>
        ));
    const summaryChip = remainingStrategies > 0 && <Chip className={'strategyChip'}>+{remainingStrategies}</Chip>;
    const featureUrl = toggleFeature === undefined ? `/archive/strategies/${name}` : `/features/strategies/${name}`;
    const functionToToggle = () => {};
    if (PATTERNFLY) {
        return renderPatternfly(feature, functionToToggle);
    } else {
        return (
            <ListItem twoLine>
                <span className={'listItemMetric'}>
                    <Progress strokeWidth={15} percentage={percent} isFallback={isStale} />
                </span>
                <span className={'listItemToggle'}>
                    <Switch
                        disabled={toggleFeature === undefined}
                        title={`Toggle ${name}`}
                        key="left-actions"
                        onChange={() => toggleFeature(name)}
                        checked={enabled}
                    />
                </span>
                <span className={['mdl-list__item-primary-content', 'listItemLink'].join(' ')}>
                    <Link to={featureUrl} className={['listLink', 'truncate'].join(' ')}>
                        {name}
                        <span className={['mdl-list__item-sub-title', 'truncate'].join(' ')}>
                            {description}
                        </span>
                    </Link>
                </span>
                <span className={['listItemStrategies', 'hideLt920'].join(' ')}>
                    {strategyChips}
                    {summaryChip}
                </span>
                {revive ? (
                    <ListItemAction onClick={() => revive(feature.name)}>
                        <Icon name="undo" />
                    </ListItemAction>
                ) : (
                    <span />
                )}
            </ListItem>
        );
    }
};

Feature.propTypes = {
    feature: PropTypes.object,
    toggleFeature: PropTypes.func,
    settings: PropTypes.object,
    metricsLastHour: PropTypes.object,
    metricsLastMinute: PropTypes.object,
    revive: PropTypes.func,
};

export default Feature;
