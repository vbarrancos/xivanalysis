import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Container, Menu } from 'semantic-ui-react'

import Icon from '@fortawesome/react-fontawesome'
import { faDiscord, faGithub } from '@fortawesome/fontawesome-free-brands'

import { getPathMatch } from 'utilities'
import logo from './logo.png'

class Header extends Component {
	static propTypes = {
		location: PropTypes.shape({
			pathname: PropTypes.string.isRequired
		}).isRequired,
		report: PropTypes.shape({
			loading: PropTypes.bool.isRequired,
			title: PropTypes.string,
			code: PropTypes.string
		})
	}

	render() {
		const {
			location: {pathname},
			report
		} = this.props
		const reportLoaded = report && !report.loading

		// This is horrid
		const {params: {
			code,
			fight: fightId,
			combatant: combatantId
		}} = getPathMatch(pathname)

		const crumbs = []

		// Report
		if (code) {
			let title = code
			if (reportLoaded) {
				title = report.title
			}
			crumbs.push({
				title,
				url: `/find/${code}/`
			})
		}

		// Fight
		if (fightId) {
			let title = fightId
			if (reportLoaded) {
				const fight = report.fights.find(fight => fight.id === parseInt(fightId, 10))
				// Do I want the kill time too?
				title = fight.name
			}
			crumbs.push({
				title,
				url: `/find/${code}/${fightId}/`
			})
		}

		// Combatant
		if (combatantId) {
			let title = combatantId
			if (reportLoaded) {
				const combatant = report.friendlies.find(friendly => friendly.id === parseInt(combatantId, 10))
				title = combatant.name
			}
			crumbs.push({
				title,
				url: `/analyse/${code}/${fightId}/${combatantId}/`
			})
		}

		return <Menu fixed="top" inverted>
			<Container>
				<Menu.Item as={Link} to="/" header>
					<img src={logo} style={{height: 20, width: 'auto', marginRight: '0.5em'}} alt="logo"/>
					xivanalysis
				</Menu.Item>
				{crumbs.map(crumb => <Menu.Item key={crumb.url} as={Link} to={crumb.url}>{crumb.title}</Menu.Item>)}

				<Menu.Menu position="right">
					<Menu.Item icon={<Icon icon={faDiscord}/>} href="https://discord.gg/jVbVe44" target="_blank"/>
					<Menu.Item icon={<Icon icon={faGithub}/>} href="https://github.com/ackwell/xivanalysis" target="_blank"/>
				</Menu.Menu>
			</Container>
		</Menu>
	}
}

const mapStateToProps = state => ({
	report: state.report
})

export default withRouter(connect(mapStateToProps)(Header))
