import ActionButton from '../common/ActionButton';
import CloseButton from '../common/CloseButton';
// import SiteTitleBackButton from '../common/SiteTitleBackButton';
import AppContext from '../../AppContext';
import InputForm from '../common/InputForm';
import {ValidateInputForm} from '../../utils/form';
import {getSimplecircLoginUrl} from '../../utils/helpers';

const React = require('react');

export default class SigninPage extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            accountType: null,
            email: ''
        };
    }

    componentDidMount() {
        const {member} = this.context;
        if (member) {
            this.context.onAction('switchPage', {
                page: 'accountHome'
            });
        }
    }

    handleSignin(e) {
        e.preventDefault();
        this.setState((state) => {
            return {
                errors: ValidateInputForm({fields: this.getInputFields({state})})
            };
        }, () => {
            const {email, errors} = this.state;
            const hasFormErrors = (errors && Object.values(errors).filter(d => !!d).length > 0);
            if (!hasFormErrors) {
                this.context.onAction('signin', {email});
            }
        });
    }

    handleSelectWebAccount(e) {
        e.preventDefault();
        this.setState({accountType: 'web'});
    }

    handleSelectPrintAccount(e) {
        e.preventDefault();
        window.location = getSimplecircLoginUrl();
    }

    handleInputChange(e, field) {
        const fieldName = field.name;
        this.setState({
            [fieldName]: e.target.value
        });
    }

    onKeyDown(e) {
        // Handles submit on Enter press
        if (e.keyCode === 13){
            this.handleSignin(e);
        }
    }

    getInputFields({state}) {
        const errors = state.errors || {};
        const fields = [
            {
                type: 'email',
                value: state.email,
                placeholder: 'jamie@example.com',
                label: 'Email',
                name: 'email',
                required: true,
                errorMessage: errors.email || '',
                autoFocus: true
            }
        ];
        return fields;
    }

    renderSubmitButton() {
        const {action} = this.context;
        let retry = false;
        const isRunning = (action === 'signin:running');
        let label = isRunning ? 'Sending login link...' : 'Continue';
        const disabled = isRunning ? true : false;
        if (action === 'signin:failed') {
            label = 'Retry';
            retry = true;
        }
        return (
            <ActionButton
                retry={retry}
                style={{width: '100%'}}
                onClick={e => this.handleSignin(e)}
                disabled={disabled}
                brandColor={this.context.brandColor}
                label={label}
                isRunning={isRunning}
            />
        );
    }

    renderWebAccountButton() {
        return (
            <ActionButton
                style={{width: '100%'}}
                onClick={e => this.handleSelectWebAccount(e)}
                brandColor={this.context.brandColor}
                label="WEB Subscription Account"
            />
        );
    }

    renderPrintAccountButton() {
        return (
            <ActionButton
                style={{width: '100%'}}
                onClick={e => this.handleSelectPrintAccount(e)}
                brandColor="var(--secondaryBrandColor)"
                label="PRINT Subscription Account"
            />
        );
    }

    renderSignupMessage() {
        const brandColor = this.context.brandColor;
        return (
            <div className='gh-portal-signup-message'>
                <div>Don't have an account?</div>
                <button className='gh-portal-btn gh-portal-btn-link' style={{color: brandColor}} onClick={() => this.context.onAction('switchPage', {page: 'signup'})}><span>Sign up</span></button>
            </div>
        );
    }

    renderForm() {
        return (
            <section>
                <div className='gh-portal-section'>
                    <InputForm
                        fields={this.getInputFields({state: this.state})}
                        onChange={(e, field) => this.handleInputChange(e, field)}
                        onKeyDown={(e, field) => this.onKeyDown(e, field)}
                    />
                </div>
            </section>
        );
    }

    renderSiteLogo() {
        const siteLogo = this.context.site.icon;

        const logoStyle = {};

        if (siteLogo) {
            logoStyle.backgroundImage = `url(${siteLogo})`;
            return (
                <img className='gh-portal-signup-logo' src={siteLogo} alt={this.context.site.title} />
            );
        }
        return null;
    }

    renderFormHeader() {
        return (
            <header className='gh-portal-signin-header'>
                {this.renderSiteLogo()}
                { this.state.accountType === null && (
                    <h2 className="gh-portal-main-title">Select Your Account Type</h2>
                )}
                { this.state.accountType === 'web' && (
                    <>
                        <h2 className="gh-portal-main-title">Account Login</h2>
                        <h3>WEB Subscription</h3>
                    </>
                )}
            </header>
        );
    }

    renderAccountTypeOptions() {
        return (
            <>
                <div className='gh-portal-content signin'>
                    <CloseButton />
                    {this.renderFormHeader()}
                </div>
                <footer className='gh-portal-signin-footer'>
                    <div className='gh-portal-signup-message'>
                        <div style={{marginBottom: '16px'}}>
                            Access your PRINT subscription account to renew your
                            magazine subscription or update your physical
                            mailing address.
                        </div>
                    </div>
                    {this.renderPrintAccountButton()}
                </footer>
                <footer className='gh-portal-signin-footer'>
                    <div className='gh-portal-signup-message'>
                        <div style={{marginBottom: '16px'}}>
                            Log into your WEB subscription account to update
                            your email address, and manage your online
                            subscription.
                        </div>
                    </div>
                    {this.renderWebAccountButton()}
                </footer>
            </>

        );
    }

    render() {
        if (this.state.accountType === null) {
            return this.renderAccountTypeOptions();
        }

        return (
            <>
                {/* <div className='gh-portal-back-sitetitle'>
                    <SiteTitleBackButton />
                </div> */}
                <CloseButton />
                <div className='gh-portal-logged-out-form-container'>
                    <div className='gh-portal-content signin'>
                        {this.renderFormHeader()}
                        {this.renderForm()}
                    </div>
                    <footer className='gh-portal-signin-footer'>
                        {this.renderSubmitButton()}
                        {this.renderSignupMessage()}
                    </footer>
                </div>
            </>
        );
    }
}
